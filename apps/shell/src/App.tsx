import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RemoteBoundary from './components/RemoteBoundary';
import LoginModal from './components/LoginModal';
import { useAuthSession } from './auth/authStore';

const RemoteProductList = lazy(() => import('catalog/ProductList'));
const RemoteCartPage = lazy(() => import('cart/CartPage'));
const RemoteCheckoutPage = lazy(() => import('orders/CheckoutPage'));
const RemoteOrdersPage = lazy(() => import('orders/OrdersPage'));

const CartRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <RemoteCartPage
      onContinueShopping={() => navigate('/products')}
      onProceedToCheckout={() => navigate('/checkout')}
    />
  );
};

const CheckoutRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthSession();

  return (
    <RemoteCheckoutPage
      onOrderSuccess={() => navigate('/orders')}
      onRequestLogin={() => openModal()}
      onBackToCart={() => navigate('/cart')}
    />
  );
};

const OrdersRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthSession();

  return (
    <RemoteOrdersPage
      onContinueShopping={() => navigate('/products')}
      onRequestLogin={() => openModal()}
    />
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={layoutStyle}>
        <Header />
        <main style={mainContentStyle}>
          <Routes>
            <Route
              path="/"
              element={
                <RemoteBoundary remoteName="Catalog">
                  <RemoteProductList />
                </RemoteBoundary>
              }
            />
            <Route
              path="/products"
              element={
                <RemoteBoundary remoteName="Catalog">
                  <RemoteProductList />
                </RemoteBoundary>
              }
            />
            <Route
              path="/cart"
              element={
                <RemoteBoundary remoteName="Cart">
                  <CartRouteWrapper />
                </RemoteBoundary>
              }
            />
            <Route
              path="/checkout"
              element={
                <RemoteBoundary remoteName="Checkout">
                  <CheckoutRouteWrapper />
                </RemoteBoundary>
              }
            />
            <Route
              path="/orders"
              element={
                <RemoteBoundary remoteName="Pesanan Saya">
                  <OrdersRouteWrapper />
                </RemoteBoundary>
              }
            />
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <h2>404 - Page Not Found</h2>
                  <p>The page you are looking for does not exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
        <LoginModal />
      </div>
    </BrowserRouter>
  );
};

export default App;

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  padding: '24px 0',
};
