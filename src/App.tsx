import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkItemProvider } from './context/WorkItemContext';
import { ThemeProvider } from './context/ThemeContext';
import { FaceswapProvider } from './context/FaceswapContext';
import { AdminProvider } from './context/AdminContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Landing from './pages/Landing';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import WorkItemDetail from './pages/WorkItemDetail';
import TodoBoard from './pages/TodoBoard';
import Settings from './pages/Settings';
import Faceswap from './pages/Faceswap';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlanManagement from './pages/admin/PlanManagement';
import CouponManagement from './pages/admin/CouponManagement';
import './App.css';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard\" replace /> : <Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth/signin" element={user ? <Navigate to="/dashboard\" replace /> : <SignIn />} />
      <Route path="/auth/signup" element={user ? <Navigate to="/dashboard\" replace /> : <SignUp />} />
      <Route path="/auth/forgot-password" element={user ? <Navigate to="/dashboard\" replace /> : <ForgotPassword />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/plans" element={
        <AdminRoute>
          <AdminLayout>
            <PlanManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/coupons" element={
        <AdminRoute>
          <AdminLayout>
            <CouponManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </AdminRoute>
      } />
      
      {/* Protected user routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/portfolio" element={
        <ProtectedRoute>
          <Layout>
            <Portfolio />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/portfolio/:id" element={
        <ProtectedRoute>
          <Layout>
            <WorkItemDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/todo" element={
        <ProtectedRoute>
          <Layout>
            <TodoBoard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/faceswap" element={
        <ProtectedRoute>
          <Layout>
            <Faceswap />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <SubscriptionProvider>
            <WorkItemProvider>
              <FaceswapProvider>
                <Router>
                  <Toaster position="top-right" />
                  <AppRoutes />
                </Router>
              </FaceswapProvider>
            </WorkItemProvider>
          </SubscriptionProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;