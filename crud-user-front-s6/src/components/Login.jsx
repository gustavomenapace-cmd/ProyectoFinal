import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import { loginApi } from '../api/auth';

export default function Login({ onLoginSuccess, addToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res && res.success) {
        addToast('¡Inicio de sesión exitoso!', 'success');
        onLoginSuccess({
          token: res.data.token,
          role: res.data.role,
          email: email,
          remember: rememberMe,
        });
      } else {
        setErrorMsg(res.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg(null);
  };

  return (
    <div className="split-screen">
      {/* SECCIÓN IZQUIERDA: FORMULARIO DE INICIO DE SESIÓN */}
      <div className="split-left">
        <div className="login-box">
          <div className="brand-header">
            <div className="brand-badge">
              <Sparkles size={14} />
              <span>CRUD Back S6 - Autenticación</span>
            </div>
            <h1>Bienvenido de nuevo</h1>
            <p>Ingrese sus credenciales para acceder al panel de gestión de usuarios.</p>
          </div>

          {errorMsg && (
            <div className="alert-error" role="alert">
              <ShieldAlert size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico / Usuario</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Lock className="input-icon" size={18} />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordar sesión</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-border" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

            {/* CREDENCIALES RÁPIDAS PARA PRUEBAS */}
            <div className="demo-section">
              <div className="demo-title">Rellenar credenciales de prueba registrada:</div>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn-demo"
                  onClick={() => setDemoCredentials('yoroot@correo.com', '123456')}
                >
                  ROOT (yoroot@correo.com)
                </button>
                <button
                  type="button"
                  className="btn-demo"
                  onClick={() => setDemoCredentials('yoadmin@gmail.com', '123456')}
                >
                  ADMIN (yoadmin@gmail.com)
                </button>
                <button
                  type="button"
                  className="btn-demo"
                  onClick={() => setDemoCredentials('youser@correo.com', '123456')}
                >
                  USER (youser@correo.com)
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FOTO COMPLETA ATTACHED (PUENTE) */}
      <div className="split-right">
        <div className="photo-wrapper">
          <img
            src="/puente.JPG"
            alt="Puente Antiguo"
            className="photo-img"
          />
          <div className="photo-overlay">
            <div className="photo-card-info">
              <h3>
                <ImageIcon size={20} />
                <span>Infraestructura & Conectividad</span>
              </h3>
              <p>
                Integra y administra los usuarios del sistema `crud-user-back-s6` con máxima seguridad, roles de acceso y auditoría en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
