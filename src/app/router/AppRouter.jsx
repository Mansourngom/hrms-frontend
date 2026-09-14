import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import BlankLayout from '../layouts/BlankLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import OTP from '../pages/OTP';
import VerifyEmail from '../pages/VerifyEmail';

import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import EmployeeDetails from '../pages/EmployeeDetails';
import Payroll from '../pages/Payroll';
import Attendance from '../pages/Attendance';
import Recruitment from '../pages/Recruitment';
import Performance from '../pages/Performance';
import Training from '../pages/Training'; // Learning
import Documents from '../pages/Documents';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import HelpCenter from '../pages/HelpCenter';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirection from Root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Guest/Public Routes */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/otp"
          element={
            <AuthLayout>
              <OTP />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmail />
            </AuthLayout>
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/employees"
          element={
            <DashboardLayout>
              <Employees />
            </DashboardLayout>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <DashboardLayout>
              <EmployeeDetails />
            </DashboardLayout>
          }
        />
        <Route
          path="/payroll"
          element={
            <DashboardLayout>
              <Payroll />
            </DashboardLayout>
          }
        />
        <Route
          path="/attendance"
          element={
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          }
        />
        <Route
          path="/recruitment"
          element={
            <DashboardLayout>
              <Recruitment />
            </DashboardLayout>
          }
        />
        <Route
          path="/performance"
          element={
            <DashboardLayout>
              <Performance />
            </DashboardLayout>
          }
        />
        <Route
          path="/learning"
          element={
            <DashboardLayout>
              <Training />
            </DashboardLayout>
          }
        />
        <Route
          path="/documents"
          element={
            <DashboardLayout>
              <Documents />
            </DashboardLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/help-center"
          element={
            <DashboardLayout>
              <HelpCenter />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Unauthorized & Wildcard Routes */}
      <Route
        path="/unauthorized"
        element={
          <BlankLayout>
            <Unauthorized />
          </BlankLayout>
        }
      />
      <Route
        path="*"
        element={
          <BlankLayout>
            <NotFound />
          </BlankLayout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
