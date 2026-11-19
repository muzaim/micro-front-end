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
  const CartPage: React.ComponentType<{ onContinueShopping?: () => void }>;
  export default CartPage;
}
