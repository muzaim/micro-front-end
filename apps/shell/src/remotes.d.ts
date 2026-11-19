declare module 'catalog/ProductList' {
  import React from 'react';
  import type { Product } from '@mfe/shared-types';
  const ProductList: React.ComponentType<{ products?: Product[] }>;
  export default ProductList;
}

declare module 'cart/MiniCartBadge' {
  import React from 'react';
  const MiniCartBadge: React.ComponentType<{ onNavigateToCart?: () => void }>;
  export default MiniCartBadge;
}

declare module 'cart/CartPage' {
  import React from 'react';
  const CartPage: React.ComponentType<{
    onContinueShopping?: () => void;
    onProceedToCheckout?: () => void;
  }>;
  export default CartPage;
}

declare module 'orders/CheckoutPage' {
  import React from 'react';
  import type { Order } from '@mfe/shared-types';
  const CheckoutPage: React.ComponentType<{
    onOrderSuccess?: (order: Order) => void;
    onRequestLogin?: () => void;
    onBackToCart?: () => void;
  }>;
  export default CheckoutPage;
}

declare module 'orders/OrdersPage' {
  import React from 'react';
  const OrdersPage: React.ComponentType<{
    onContinueShopping?: () => void;
    onRequestLogin?: () => void;
  }>;
  export default OrdersPage;
}
