import type { Product } from '@mfe/shared-types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Audio',
  },
  {
    id: 'prod-2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    description: 'RGB backlit mechanical keyboard with hot-swappable switches and aluminum frame.',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
    category: 'Peripherals',
  },
  {
    id: 'prod-3',
    name: 'Ultra-Wide Curved Monitor 34"',
    price: 499.00,
    description: '144Hz 1ms curved gaming monitor with HDR400 and ultra-wide 21:9 aspect ratio.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    category: 'Displays',
  },
  {
    id: 'prod-4',
    name: 'Ergonomic Wireless Mouse',
    price: 59.90,
    description: 'Precision ergonomic mouse designed to reduce wrist strain with customizable buttons.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    category: 'Peripherals',
  },
];
