import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { X, LogIn, Mail, Lock, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError('Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo para restablecer la contraseña');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-panorama-navy/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-panorama-red transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-panorama-navy rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl rotate-3">
              <LogIn size={32} />
            </div>
            <h2 className="text-3xl font-news font-black text-panorama-navy uppercase tracking-tight">Acceso Admin</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">TendenciaRD System</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {resetSent && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-medium"
            >
              <Mail size={18} />
              Correo de recuperación enviado
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 focus:border-panorama-red focus:bg-white outline-none font-bold transition-all"
                  placeholder="admin@tendenciard.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contraseña</label>
                <button 
                  type="button"
                  onClick={handleResetPassword}
                  className="text-[10px] font-black uppercase text-panorama-red hover:underline"
                >
                  ¿Olvidaste la clave?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 focus:border-panorama-red focus:bg-white outline-none font-bold transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-panorama-navy text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
              Entrar al Panel
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400">O accede con</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-100 text-panorama-navy py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 transform active:scale-95"
          >
            <Chrome size={18} className="text-panorama-red" />
            Cuenta de Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};
