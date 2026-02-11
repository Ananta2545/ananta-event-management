import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader text="Authenticating..." />
    </div>
  );

  if (!user) return <Navigate to="/admin/login" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} />;

  return children;
};

export default ProtectedRoute;
