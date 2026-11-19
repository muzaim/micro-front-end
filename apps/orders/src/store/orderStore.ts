import { useState, useEffect } from 'react';
import type { Order, CartItem, AuthSession, ShippingAddress, PaymentMethod } from '@mfe/shared-types';
import { publishCartClear, publishOrderCreated, subscribeAuthStateChange } from '@mfe/shared-events';

const ORDERS_STORAGE_KEY = 'mfe_ecommerce_orders';
const AUTH_STORAGE_KEY = 'mfe_auth_session';

export function getCartStorageKey(userId?: string): string {
  return userId ? `mfe_ecommerce_cart_${userId}` : 'mfe_ecommerce_cart_guest';
}

class OrderStore {
  private orders: Order[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      subscribeAuthStateChange(() => {
        this.loadFromStorage();
        this.notify();
      });
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      this.orders = data ? JSON.parse(data) : [];
    } catch {
      this.orders = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch {
      // Ignore quota errors
    }
  }

  private notify(): void {
    this.saveToStorage();
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getActiveSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const session = this.getActiveSession();
      const key = getCartStorageKey(session?.user?.id);
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
      if (!session?.user?.id) {
        const legacy = localStorage.getItem('mfe_ecommerce_cart');
        return legacy ? JSON.parse(legacy) : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  public getOrdersForCurrentUser(): Order[] {
    this.loadFromStorage();
    const session = this.getActiveSession();
    if (!session || !session.user) {
      return [];
    }
    return this.orders.filter((order) => order.userId === session.user.id);
  }

  public createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): { success: boolean; order?: Order; error?: string } {
    const session = this.getActiveSession();
    if (!session || !session.user || !session.token) {
      return { success: false, error: 'Silakan login terlebih dahulu untuk melanjutkan checkout.' };
    }

    const items = this.getCartItems();
    if (items.length === 0) {
      return { success: false, error: 'Keranjang belanja Anda kosong.' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      userId: session.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.notify();

    // Clear cart in local storage and notify system
    if (typeof window !== 'undefined') {
      try {
        const key = getCartStorageKey(session.user.id);
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
      publishCartClear();
      publishOrderCreated(newOrder);
    }

    return { success: true, order: newOrder };
  }
}

export const orderStore = new OrderStore();

export function useOrders(): { orders: Order[]; session: AuthSession | null; refresh: () => void } {
  const [orders, setOrders] = useState<Order[]>(() => orderStore.getOrdersForCurrentUser());
  const [session, setSession] = useState<AuthSession | null>(() => orderStore.getActiveSession());

  useEffect(() => {
    const unsubscribe = orderStore.subscribe(() => {
      setOrders(orderStore.getOrdersForCurrentUser());
      setSession(orderStore.getActiveSession());
    });

    const unsubscribeAuth = subscribeAuthStateChange((newSession) => {
      setSession(newSession);
      setOrders(orderStore.getOrdersForCurrentUser());
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const refresh = () => {
    setOrders(orderStore.getOrdersForCurrentUser());
    setSession(orderStore.getActiveSession());
  };

  return { orders, session, refresh };
}
