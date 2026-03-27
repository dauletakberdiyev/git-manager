import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/projects', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <p className="text-gray-400">Authenticating...</p>
    </div>
  );
}
