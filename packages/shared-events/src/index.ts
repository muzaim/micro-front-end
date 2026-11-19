import type { Product, Order, AuthSession } from '@mfe/shared-types';

// Cart Events
export const CART_ADD_ITEM_EVENT = 'cart:add-item';
export const CART_CLEAR_EVENT = 'cart:clear';

export interface CartAddItemDetail {
  product: Product;
}

export function publishAddToCart(product: Product): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<CartAddItemDetail>(CART_ADD_ITEM_EVENT, {
      detail: { product },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }
}

export function subscribeAddToCart(callback: (product: Product) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<CartAddItemDetail>;
    if (customEvent.detail && customEvent.detail.product) {
      callback(customEvent.detail.product);
    }
  };

  window.addEventListener(CART_ADD_ITEM_EVENT, handler);
  return () => {
    window.removeEventListener(CART_ADD_ITEM_EVENT, handler);
  };
}

export function publishCartClear(): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(CART_CLEAR_EVENT, {
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }
}

export function subscribeCartClear(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => {
    callback();
  };

  window.addEventListener(CART_CLEAR_EVENT, handler);
  return () => {
    window.removeEventListener(CART_CLEAR_EVENT, handler);
  };
}

// Auth Events
export const AUTH_STATE_CHANGE_EVENT = 'auth:state-change';

export interface AuthStateChangeDetail {
  session: AuthSession | null;
}

export function publishAuthStateChange(session: AuthSession | null): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<AuthStateChangeDetail>(AUTH_STATE_CHANGE_EVENT, {
      detail: { session },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }
}

export function subscribeAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<AuthStateChangeDetail>;
    callback(customEvent.detail ? customEvent.detail.session : null);
  };

  window.addEventListener(AUTH_STATE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handler);
  };
}

// Order Events
export const ORDER_CREATED_EVENT = 'order:created';

export interface OrderCreatedDetail {
  order: Order;
}

export function publishOrderCreated(order: Order): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<OrderCreatedDetail>(ORDER_CREATED_EVENT, {
      detail: { order },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }
}

export function subscribeOrderCreated(callback: (order: Order) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<OrderCreatedDetail>;
    if (customEvent.detail && customEvent.detail.order) {
      callback(customEvent.detail.order);
    }
  };

  window.addEventListener(ORDER_CREATED_EVENT, handler);
  return () => {
    window.removeEventListener(ORDER_CREATED_EVENT, handler);
  };
}
