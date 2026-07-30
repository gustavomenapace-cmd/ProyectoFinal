import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem('crud_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (data) => {
    setAuthData(data);
    if (data.remember) {
      localStorage.setItem('crud_auth_session', JSON.stringify(data));
    }
  };

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem('crud_auth_session');
    addToast('Sesión cerrada correctamente.', 'info');
  };

  return (
    <>
      {authData ? (
        <Dashboard
          authData={authData}
          onLogout={handleLogout}
          addToast={addToast}
        />
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          addToast={addToast}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
