import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from '../components/unlogged/Login';
import Signup from '../components/unlogged/Signup';

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen relative bg-gray-100 flex items-center justify-center">
      <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(79, 70, 229, 0.7)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(147, 51, 234, 0.7)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(79, 70, 229, 0.7)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(147, 51, 234, 0.7)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          fill="url(#gradient1)"
          d="M0,256C150,128,450,128,600,256L1440,320L0,320Z"
        />
        <path
          fill="url(#gradient2)"
          d="M0,128C150,256,450,256,600,128L1440,0L0,0Z"
        />
      </svg>

      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl rounded-2xl transform transition-all duration-500 hover:scale-105 z-10">
        <header className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Se connecter à votre compte' : 'Créer un nouveau compte'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to={isLogin ? '/signup' : '/login'} className="text-blue-500 hover:underline transition-colors duration-300">
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </Link>
          </p>
        </header>

        <div className="space-y-6">
          {isLogin ? <Login /> : <Signup />}
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-blue-500 hover:underline transition-colors duration-300">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
