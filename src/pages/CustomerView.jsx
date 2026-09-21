import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Search, ShoppingBag, Plus, Minus, Trash2, X, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Mengimpor koneksi Supabase

export default function CustomerView({ isCartOpen, setIsCartOpen }) {
  const { categories, menuItems, cart, addToCart, updateCartQty, removeFromCart, whatsappNumber } = useCatalog();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckoutWhatsApp = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert('Mohon isi nama Anda terlebih dahulu sebelum memesan.');
      return;
    }

    // 1. Catat riwayat pesanan (history) secara otomatis ke database Supabase
    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: customerName,
          customer_note: customerNote || '-',
          items: cart, // Menyimpan detail daftar belanjaan
          total_price: subtotal
        }
      ]);

      if (error) {
        console.error('Gagal mencatat history ke Supabase:', error.message);
      }
    } catch (err) {
      console.error('Terjadi kesalahan koneksi:', err);
    }

    // 2. Buat format pesan WhatsApp
    let message = `Halo Kak, saya *${customerName}* ingin memesan:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
    });
    message += `\n*Subtotal: Rp ${subtotal.toLocaleString('id-ID')}*`;
    if (customerNote) {
      message += `\n*Catatan:* ${customerNote}`;
    }
    message += `\n\nTerima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/10 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 max-w-lg">
          <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Pesan Makanan Online</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-2">Nikmati Hidangan Lezat Setiap Hari</h2>
          <p className="text-orange-100 text-sm sm:text-base">Pilih menu favoritmu, masukkan keranjang, dan langsung pesan via WhatsApp dengan mudah.</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari makanan atau minuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white text-slate-800 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-orange-600 text-white shadow-orange-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Menu
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition shadow-sm ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-base">Tidak ada menu yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition group">
              <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer" onClick={() => setSelectedItem(item)}>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-1 stroke-1" />
                    <span className="text-xs">Belum ada foto</span>
                  </div>
                )}
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {item.badge}
                  </span>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white font-bold text-sm px-4 py-1.5 rounded-full">Habis</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h3 className="font-bold text-slate-800 text-lg cursor-pointer hover:text-orange-600 transition" onClick={() => setSelectedItem(item)}>
                    {item.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="font-extrabold text-orange-600 text-lg">Rp {item.price.toLocaleString('id-ID')}</span>
                  <button
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1.5 transition ${
                      item.isAvailable
                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="relative h-64 bg-slate-100 flex items-center justify-center">
              {selectedItem.image ? (
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-1 stroke-1" />
                  <span className="text-xs">Belum ada foto</span>
                </div>
              )}
              <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 bg-white/85 hover:bg-white text-slate-700 p-2 rounded-full shadow transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-800">{selectedItem.name}</h3>
                <span className="text-xl font-extrabold text-orange-600">Rp {selectedItem.price.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{selectedItem.description || 'Tidak ada deskripsi.'}</p>
              <button
                onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                disabled={!selectedItem.isAvailable}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-orange-600/20 transition flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Masukkan Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-slate-800 text-lg">Keranjang Belanja ({totalQty})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 stroke-1 text-slate-300" />
                    <p className="font-medium">Keranjang kamu masih kosong.</p>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                            <p className="text-xs text-orange-600 font-semibold mt-0.5">Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <button onClick={() => updateCartQty(item.id, -1)} className="p-1.5 text-slate-600 hover:bg-slate-100"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="px-2.5 text-xs font-bold text-slate-800">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)} className="p-1.5 text-slate-600 hover:bg-slate-100"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1.5"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 space-y-3 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Pemesan *</label>
                        <input
                          type="text"
                          placeholder="Masukkan nama Anda"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Catatan (Opsional)</label>
                        <textarea
                          placeholder="Contoh: Jangan pakai pedas"
                          value={customerNote}
                          onChange={(e) => setCustomerNote(e.target.value)}
                          rows="2"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-600 font-medium">Subtotal</span>
                    <span className="text-xl font-extrabold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <button
                    onClick={handleCheckoutWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center space-x-2 text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Pesan via WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}