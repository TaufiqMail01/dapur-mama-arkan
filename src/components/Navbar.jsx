import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Utensils, Settings, ShoppingBag, Store, LogOut } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Navbar({ onOpenCart, cartCount }) {
  const { mode, setMode, isAdminAuthenticated, logoutAdmin } = useCatalog();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setMode('customer')}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">Dapur Mama Arkan</h1>
              <p className="text-xs text-slate-500">Katalog Makanan & Minuman</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {mode === 'customer' ? (
              <>
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center space-x-2 bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-xl font-medium transition"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:inline">Keranjang</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleAdminClick}
                  className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-sm font-medium transition"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMode('customer')}
                  className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-orange-600/20 transition"
                >
                  <Store className="w-4 h-4" />
                  <span>Lihat Katalog</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Keluar Admin"
                  className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}