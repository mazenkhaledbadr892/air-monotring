import React, { useState } from 'react';
import { Wind } from './icons/Icons';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation
    if (username && password) {
      onLogin();
    } else {
      setError('Please enter username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-bkg-light to-gray-100 dark:from-bkg-dark dark:to-slate-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
            <div className="p-3 bg-accent/10 rounded-full text-accent">
                <Wind className="w-10 h-10" />
            </div>
          <h1 className="mt-4 text-3xl font-bold text-center text-text-light-primary dark:text-text-dark-primary">
            Air Monitor Login
          </h1>
          <p className="mt-2 text-sm text-center text-text-light-secondary dark:text-text-dark-secondary">
            Sign in to access your dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-text-light-primary dark:text-text-dark-primary bg-bkg-light dark:bg-bkg-dark border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-text-light-primary dark:text-text-dark-primary bg-bkg-light dark:bg-bkg-dark border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-md shadow-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card-light dark:bg-card-dark text-text-light-secondary dark:text-text-dark-secondary">
              Or
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={onLogin}
            className="w-full px-4 py-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;