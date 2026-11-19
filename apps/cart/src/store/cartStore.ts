import { useState, useEffect } from 'react';
import type { CartItem, Product } from '@mfe/shared-types';
import { subscribeAddToCart, subscribeCartClear, subscribeAuthStateChange } from '@mfe/shared-events';

export const AUTH_STORAGE_KEY = 'mfe_auth_session';

export function getCartStorageKey(userId?: string): string {
  return userId ? `mfe_ecommerce_cart_${userId}` : 'mfe_ecommerce_cart_guest';
}

class CartStore {
  private items: CartItem[] = [];
  private currentUserId?: string;
  private listeners: Set<() => void> = new Set();
  private unsubscribeEvent?: () => void;
  private unsubscribeClearEvent?: () => void;
  private unsubscribeAuthEvent?: () => void;

  constructor() {
    this.currentUserId = this.getActiveUserId();
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      this.unsubscribeEvent = subscribeAddToCart((product: Product) => {
        this.addItem(product);
      });
      this.unsubscribeClearEvent = subscribeCartClear(() => {
        this.clearCart();
      });
      this.unsubscribeAuthEvent = subscribeAuthStateChange((session) => {
        const newUserId = session?.user?.id;
        if (newUserId !== this.currentUserId) {
          this.currentUserId = newUserId;
          this.loadFromStorage();
          this.listeners.forEach((listener) => listener());
        }
      });
    }
  }

  private getActiveUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        return session?.user?.id;
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const key = getCartStorageKey(this.currentUserId);
      const data = localStorage.getItem(key);
      if (data) {
        this.items = JSON.parse(data);
      } else {
        if (!this.currentUserId) {
          const legacy = localStorage.getItem('mfe_ecommerce_cart');
          this.items = legacy ? JSON.parse(legacy) : [];
        } else {
          this.items = [];
        }
      }
    } catch {
      this.items = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const key = getCartStorageKey(this.currentUserId);
      localStorage.setItem(key, JSON.stringify(this.items));
    } catch {
      // Ignore quota/storage errors
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

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public getTotalCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  public getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  public addItem(product: Product) {
    const existingIndex = this.items.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.notify();
  }

  public updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.notify();
    }
  }

  public removeItem(productId: string) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.notify();
  }

  public clearCart() {
    this.items = [];
    if (typeof window !== 'undefined') {
      try {
        const key = getCartStorageKey(this.currentUserId);
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }
    this.notify();
  }
}

export const cartStore = new CartStore();

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => cartStore.getItems());
  const [totalCount, setTotalCount] = useState<number>(() => cartStore.getTotalCount());
  const [totalPrice, setTotalPrice] = useState<number>(() => cartStore.getTotalPrice());

  useEffect(() => {
    const update = () => {
      setItems(cartStore.getItems());
      setTotalCount(cartStore.getTotalCount());
      setTotalPrice(cartStore.getTotalPrice());
    };
    const unsubscribe = cartStore.subscribe(update);
    return unsubscribe;
  }, []);

  return {
    items,
    totalCount,
    totalPrice,
    addItem: (p: Product) => cartStore.addItem(p),
    updateQuantity: (id: string, q: number) => cartStore.updateQuantity(id, q),
    removeItem: (id: string) => cartStore.removeItem(id),
    clearCart: () => cartStore.clearCart(),
  };
}
