import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RemoteBoundary from './components/RemoteBoundary';

const RemoteProductList = lazy(() => import('catalog/ProductList'));
const RemoteCartPage = lazy(() => import('cart/CartPage'));

const CartRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <RemoteCartPage onContinueShopping={() => navigate('/products')} />
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
