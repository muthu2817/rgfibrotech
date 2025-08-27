'use client'
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Components/sidebar';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchUserInfo } from './store/slices/authSlice';
import { LogOut } from 'lucide-react';
import { fetchDepartments } from './store/slices/departmentSlice';
import Loader from './Components/Loader';


export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/';

  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const isAuthRehydrated = useSelector(state => state.auth?._persist?.rehydrated);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Wait for auth slice to rehydrate before auth checks/redirects
  useEffect(() => {
    if (!isAuthRehydrated) return;

    if (!token) {
      if (!isLogin) {
        setIsRedirecting(true);
        router.push('/');
      }
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      if (isLogin) {
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    }
    setIsCheckingAuth(false);
  }, [isAuthRehydrated, token, isLogin, router, pathname]);

  // On first authenticated load, fetch boot data (departments)
  useEffect(() => {
    if (!isAuthRehydrated) return;
    if (token) {
      dispatch(fetchDepartments());
    }
  }, [isAuthRehydrated, token, dispatch]);

  // Fetch user info on refresh and on route changes when token exists
  useEffect(() => {
    if (!isAuthRehydrated) return;
    if (token) {
      (async () => {
        try {
          await dispatch(fetchUserInfo()).unwrap();
        } catch (_) {
          // ignore fetch errors here; auth flow will handle redirects
        }
      })();
    }

    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && token) {
        dispatch(fetchUserInfo()).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthRehydrated, token, pathname, dispatch]);

  // Stop showing loader once the pathname changes to the target page
  useEffect(() => {
    if (isRedirecting) {
      const goingToDashboard = token && pathname === '/dashboard';
      const backToLogin = !token && pathname === '/';
      if (goingToDashboard || backToLogin) {
        setIsRedirecting(false);
      }
    }
  }, [isRedirecting, pathname, token]);

 
  if (isCheckingAuth || isRedirecting || !isAuthRehydrated) {
    return (
      <div className="grid place-items-center min-h-screen bg-gray-50">
        <Loader/>
      </div>
    );
  }

  return (isLogin && !isAuthenticated) ? (
    <div className="bg-gray-100 h-screen">{children}</div>
  ) : (
    <div className="flex h-screen ">
        <Sidebar />
      <main className="h-screen flex flex-col overflow-y-hidden bg-gray-50 w-full">
        {children}
      </main>
    </div>
  );
}
