import { useState, useEffect } from 'react';
import type { AuthSession, AuthUser } from '@mfe/shared-types';
import { publishAuthStateChange, subscribeAuthStateChange } from '@mfe/shared-events';

export const AUTH_STORAGE_KEY = 'mfe_auth_session';

export interface DummyAccount {
  email: string;
  aliasEmail?: string;
  password: string;
  user: AuthUser;
  token: string;
}

export const DUMMY_USERS: DummyAccount[] = [
  {
    email: 'budi@mfe.com',
    aliasEmail: 'user@mfe.com',
    password: 'password123',
    user: {
      id: 'usr-001',
      name: 'Budi Santoso',
      email: 'budi@mfe.com',
    },
    token: 'mock-jwt-budi-001',
  },
  {
    email: 'siti@mfe.com',
    password: 'password123',
    user: {
      id: 'usr-002',
      name: 'Siti Rahma',
      email: 'siti@mfe.com',
    },
    token: 'mock-jwt-siti-002',
  },
  {
    email: 'andi@mfe.com',
    password: 'password123',
    user: {
      id: 'usr-003',
      name: 'Andi Pratama',
      email: 'andi@mfe.com',
    },
    token: 'mock-jwt-andi-003',
  },
];

export const DUMMY_CREDENTIALS = DUMMY_USERS[0];

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
    const cleanedEmail = email.trim().toLowerCase();
    const matchedAccount = DUMMY_USERS.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanedEmail || acc.aliasEmail?.toLowerCase() === cleanedEmail) &&
        acc.password === password
    );

    if (matchedAccount) {
      this.session = {
        token: matchedAccount.token,
        user: matchedAccount.user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      this.isModalOpen = false;
      this.notify();
      publishAuthStateChange(this.session);
      return { success: true };
    }

    return {
      success: false,
      error: 'Email atau password salah. Silakan pilih salah satu akun dummy yang tersedia.',
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
