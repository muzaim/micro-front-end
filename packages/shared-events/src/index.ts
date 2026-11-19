import type { Product } from '@mfe/shared-types';

export const CART_ADD_ITEM_EVENT = 'cart:add-item';

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
