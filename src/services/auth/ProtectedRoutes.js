import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../services/auth/authContext';

function ProtectedRoutes({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/processing" && !isAuthenticated) {
      router.push("/");
    }
  }, [router.pathname, isAuthenticated]);

  return children;
}

export default ProtectedRoutes;
