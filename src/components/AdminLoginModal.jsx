import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Lock, X, ShieldAlert } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose }) {
  const { loginAdmin } = useCatalog();
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (success) {
      setPasswordInput('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Password salah!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Autentikasi Admin</h3>
          <p className="text-xs text-slate-500 mt-1">Masukkan password rahasia untuk mengakses panel pengelola.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Masukkan Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-300"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-red-500 text-center mt-2 font-medium flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-600/20 transition text-sm"
          >
            Masuk Admin
          </button>
        </form>
      </div>
    </div>
  );
}