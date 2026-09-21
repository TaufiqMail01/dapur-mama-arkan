import React, { useState, useEffect } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';
import { Store, ShieldCheck, Lock, ShoppingBag, X, LogOut } from 'lucide-react';

// Tentukan batas waktu inaktif (Contoh: 5 menit dalam milidetik)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; 

function MainApp() {
  // 1. Refresh (F5) = Auto Logout (Status awal selalu false saat pertama dimuat)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('customer');

  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ambil state toko dan fungsi dari CatalogContext
  const { adminPassword, cart, storeName, storeSubtitle } = useCatalog();
  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Fungsi untuk memperbarui waktu aktivitas terakhir
  const updateActivity = () => {
    if (isAdminLoggedIn) {
      localStorage.setItem('dapur_last_active', Date.now().toString());
    }
  };

  // 2. Timeout (Inaktivitas) = Auto Logout setelah waktu habis tanpa aktivitas
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Set waktu aktif awal saat berhasil login
    updateActivity();

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Pengecekan berkala setiap 1 menit
    const interval = setInterval(() => {
      const lastActive = localStorage.getItem('dapur_last_active');
      if (lastActive) {
        const now = Date.now();
        if (now - Number(lastActive) > INACTIVITY_TIMEOUT) {
          alert('Sesi admin telah habis karena tidak ada aktivitas selama 5 menit. Anda otomatis keluar.');
          handleLogout();
        }
      }
    }, 60000); // Cek tiap 1 menit

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [isAdminLoggedIn]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginPassword === adminPassword) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
      localStorage.setItem('dapur_last_active', Date.now().toString());
      setIsLoginModalOpen(false);
      setLoginPassword('');
    } else {
      alert('Password admin salah!');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('customer');
    localStorage.removeItem('dapur_last_active');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Navbar Atas */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('customer')}>
            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              {/* Nama Toko Dinamis dari Pengaturan Admin */}
              <h1 className="font-extrabold text-slate-800 text-lg leading-tight">{storeName}</h1>
              {/* Tulisan Kecil di Bawah Dinamis dari Pengaturan Admin */}
              <p className="text-xs text-slate-400 font-medium">{storeSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentView === 'admin' ? (
              <>
                <button
                  onClick={() => setCurrentView('customer')}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition shadow-md shadow-orange-600/20 flex items-center space-x-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Lihat Katalog</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition flex items-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition flex items-center space-x-2 text-sm font-bold"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:inline">Keranjang</span>
                  {totalCartQty > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow">
                      {totalCartQty}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      setCurrentView('admin');
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Admin Panel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-grow">
        {currentView === 'customer' ? (
          <CustomerView isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        ) : (
          <AdminView />
        )}
      </main>

      {/* Modal Login Admin */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Login Admin</h3>
                <p className="text-xs text-slate-400">Masukkan password untuk mengelola menu</p>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password Admin"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                autoFocus
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-orange-600/20"
              >
                Masuk ke Panel Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <MainApp />
    </CatalogProvider>
  );
}