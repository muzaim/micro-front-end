import { useState, useEffect } from 'react';
import type { AuthSession, AuthUser } from '@mfe/shared-types';
import { publishAuthStateChange, subscribeAuthStateChange } from '@mfe/shared-events';

export const AUTH_STORAGE_KEY = 'mfe_auth_session';

export const DUMMY_CREDENTIALS = {
  email: 'user@mfe.com',
  password: 'password123',
  user: {
    id: 'usr-888',
    name: 'Budi Developer',
    email: 'user@mfe.com',
  } as AuthUser,
  token: 'mock-jwt-token-mfe-2026-usr888',
};

class AuthStore {
  private session: AuthSession | null = null;
  private isModalOpen: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:open-modal', () => {
        this.openModal();
      });
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      this.session = data ? JSON.parse(data) : null;
    } catch {
      this.session = null;
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (this.session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSession(): AuthSession | null {
    return this.session;
  }

  public getIsModalOpen(): boolean {
    return this.isModalOpen;
  }

  public openModal(): void {
    this.isModalOpen = true;
    this.listeners.forEach((listener) => listener());
  }

  public closeModal(): void {
    this.isModalOpen = false;
    this.listeners.forEach((listener) => listener());
  }

  public login(email: string, password: string): { success: boolean; error?: string } {
    if (
      email.trim().toLowerCase() === DUMMY_CREDENTIALS.email &&
      password === DUMMY_CREDENTIALS.password
    ) {
      this.session = {
        token: DUMMY_CREDENTIALS.token,
        user: DUMMY_CREDENTIALS.user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      this.isModalOpen = false;
      this.notify();
      publishAuthStateChange(this.session);
      return { success: true };
    }

    return {
      success: false,
      error: 'Email atau password salah. Gunakan user@mfe.com dan password123',
    };
  }

  public logout(): void {
    this.session = null;
    this.notify();
    publishAuthStateChange(null);
  }
}

export const authStore = new AuthStore();

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => authStore.getSession());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => authStore.getIsModalOpen());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setSession(authStore.getSession());
      setIsModalOpen(authStore.getIsModalOpen());
    });

    const unsubscribeEvent = subscribeAuthStateChange((newSession) => {
      setSession(newSession);
    });

    return () => {
      unsubscribe();
      unsubscribeEvent();
    };
  }, []);

  return {
    session,
    isAuthenticated: !!session?.token,
    isModalOpen,
    openModal: () => authStore.openModal(),
    closeModal: () => authStore.closeModal(),
    login: (email: string, password: string) => authStore.login(email, password),
    logout: () => authStore.logout(),
  };
}
