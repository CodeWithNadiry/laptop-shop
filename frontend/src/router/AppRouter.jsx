import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/main-layout/MainLayout";
import AdminLayout from "../features/admin/pages/AdminLayout";
import AdminRoute from "./AdminRoute";

// Public pages
import { Home, NotFound, Product, Collection, QuickView } from "../pages";
// Auth
import { Login, Signup } from "../features/auth";

// Admin pages
import {
  AddProduct,
  AdminDashboard,
  AdminProducts,
  EditProduct,
  AdminOrders,
  AdminUsers,
  AdminRevenue,
} from "../features/admin";
import { UserOrders, Checkout } from "../features/order";
import UserProfile from "../features/user-profile/components/UserProfile";
import {
  ResetPassword,
  ResetRequest,
} from "../features/reset-password/components";
import ProfileRouter from "./ProfileRouter";

// User pages

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Public Pages */}
          <Route index element={<Home />} />
          <Route path="collections/:collectionSlug" element={<Collection />} />
          <Route
            path="collections/:collectionSlug/products/:productSlug"
            element={<Product />}
          />

          {/* Auth Pages */}
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/signup" element={<Signup />} />

          <Route path="auth/reset" element={<ResetRequest />} />
          <Route path="auth/reset/:token" element={<ResetPassword />} />
          {/* User Pages */}
          <Route
            path="profile"
            element={
              <ProfileRouter>
                <UserProfile />
              </ProfileRouter>
            }
          />
          <Route path="orders" element={<UserOrders />} />
          <Route path="checkout" element={<Checkout />} />

          {/* 🔐 ADMIN ROUTES */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:prodId" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="revenue" element={<AdminRevenue />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
