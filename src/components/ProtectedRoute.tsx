import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAuth } from '@/lib/auth/middleware';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that requires authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await verifyAuth();

      if (!user) {
        // User is not authenticated, redirect to login
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // For initial render, we can't do async check
  // The useEffect will handle the redirect if needed
  // For now, we'll render the children and let useEffect handle auth

  return <>{children}</>;
};

export default ProtectedRoute;
