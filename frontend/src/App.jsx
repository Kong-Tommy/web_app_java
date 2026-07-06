import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { StaffAuthProvider } from './context/StaffAuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function StorefrontLayout({ children }) {
  return (
    <>
      <Header />
      <CategoryNav />
      {children}
    </>
  );
}

export default function App() {
  return (
    <StaffAuthProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
              </Route>

              <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
              <Route path="/search" element={<StorefrontLayout><SearchPage /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
              <Route path="/login" element={<StorefrontLayout><LoginPage /></StorefrontLayout>} />
              <Route path="/register" element={<StorefrontLayout><RegisterPage /></StorefrontLayout>} />
              <Route path="/orders" element={<StorefrontLayout><OrdersPage /></StorefrontLayout>} />
              <Route path="/orders/:id" element={<StorefrontLayout><OrderDetailPage /></StorefrontLayout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </CustomerAuthProvider>
    </StaffAuthProvider>
  );
}
