export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt?: number;
}

export type PaymentMethod = 'qris' | 'bank_transfer' | 'cod';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'paid' | 'processing' | 'delivered';
  createdAt: string;
}
