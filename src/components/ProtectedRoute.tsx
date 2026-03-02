import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../lib/supabase';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-sh-black flex items-center justify-center text-sh-neon font-black italic animate-pulse">VALIDANDO ACESSO...</div>;
  }

  if (!authenticated) {
    
    return <Navigate to="/vestiario" replace />;
  }

  return children;
};