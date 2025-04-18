import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredFeature }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول مع حفظ المسار الذي كان يحاول الوصول إليه
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من صلاحيات المستخدم إذا كانت الميزة مطلوبة
  if (requiredFeature && !hasPermission(requiredFeature)) {
    // إعادة توجيه المستخدم إلى صفحة الاشتراكات إذا لم يكن لديه صلاحية الوصول
    return <Navigate to="/subscriptions" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
