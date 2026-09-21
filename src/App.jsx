import React, { useState } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';

function MainApp() {
  const { mode, cart } = useCatalog();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={cartCount} />
      
      <main className="flex-grow">
        {mode === 'customer' ? (
          <CustomerView isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        ) : (
          <AdminView />
        )}
      </main>

      <Footer />
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