import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Plus, Edit, Trash2, FolderPlus, Phone, Lock } from 'lucide-react';

export default function AdminView() {
  const { 
    categories, menuItems, whatsappNumber, setWhatsappNumber,
    adminPassword, setAdminPassword,
    addCategory, editCategory, deleteCategory,
    addMenuItem, editMenuItem, deleteMenuItem 
  } = useCatalog();

  const [activeTab, setActiveTab] = useState('menu');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catNameInput, setCatNameInput] = useState('');

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [menuForm, setMenuForm] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    image: '',
    description: '',
    badge: '',
    isAvailable: true
  });

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;
    if (editingCat) {
      editCategory(editingCat.id, catNameInput);
    } else {
      addCategory(catNameInput);
    }
    setCatNameInput('');
    setEditingCat(null);
    setIsCatModalOpen(false);
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    if (!menuForm.name.trim() || !menuForm.price) return;

    const payload = {
      ...menuForm,
      price: Number(menuForm.price),
      categoryId: menuForm.categoryId || categories[0]?.id
    };

    if (editingMenu) {
      editMenuItem(editingMenu.id, payload);
    } else {
      addMenuItem(payload);
    }

    setEditingMenu(null);
    setMenuForm({
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      image: '',
      description: '',
      badge: '',
      isAvailable: true
    });
    setIsMenuModalOpen(false);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    setAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    alert('Password admin berhasil diperbarui!');
  };

  const openAddMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      description: '',
      badge: '',
      isAvailable: true
    });
    setIsMenuModalOpen(true);
  };

  const openEditMenu = (item) => {
    setEditingMenu(item);
    setMenuForm({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      image: item.image,
      description: item.description,
      badge: item.badge || '',
      isAvailable: item.isAvailable
    });
    setIsMenuModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Admin Panel Katalog</h2>
            <p className="text-slate-500 text-sm mt-1">Kelola menu, kategori, dan nomor WhatsApp pesanan sesuka Anda.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'menu' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Daftar Menu
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'categories' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Kategori
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'settings' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pengaturan
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'menu' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Semua Menu Makanan & Minuman ({menuItems.length})</h3>
            <button
              onClick={openAddMenu}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-2xl shadow-md shadow-orange-600/20 text-sm flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Menu Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => {
              const cat = categories.find(c => c.id === item.categoryId);
              return (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="relative h-44 bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {cat?.name || 'Tanpa Kategori'}
                    </span>
                    {!item.isAvailable && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Habis
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.description}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-orange-600">Rp {item.price.toLocaleString('id-ID')}</span>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditMenu(item)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm(`Hapus menu "${item.name}"?`)) deleteMenuItem(item.id); }} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Kelola Kategori Menu</h3>
            <button
              onClick={() => { setEditingCat(null); setCatNameInput(''); setIsCatModalOpen(true); }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-2xl shadow-md shadow-orange-600/20 text-sm flex items-center space-x-2 transition"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat, index) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 bg-orange-100 text-orange-600 font-bold rounded-xl flex items-center justify-center text-xs">{index + 1}</span>
                  <span className="font-bold text-slate-800 text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => { setEditingCat(cat); setCatNameInput(cat.name); setIsCatModalOpen(true); }} className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition text-xs font-medium flex items-center space-x-1">
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => { if (confirm(`Hapus kategori "${cat.name}"?`)) deleteCategory(cat.id); }} className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-xl border border-slate-200 transition text-xs font-medium flex items-center space-x-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-xl">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pengaturan WhatsApp Checkout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp Toko</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Contoh: 62..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ubah Password Admin</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm transition shadow-md shadow-orange-600/20"
              >
                Simpan Password Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Category */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingCat ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  placeholder="Contoh: Makanan Berat"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition">Batal</button>
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md shadow-orange-600/20 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Menu Form */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
            <form onSubmit={handleMenuSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                  placeholder="Contoh: Ayam Geprek"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Kategori</label>
                  <select
                    value={menuForm.categoryId}
                    onChange={(e) => setMenuForm({...menuForm, categoryId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                    placeholder="25000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">URL Gambar (Foto)</label>
                <input
                  type="text"
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Badge (Opsional)</label>
                  <input
                    type="text"
                    value={menuForm.badge}
                    onChange={(e) => setMenuForm({...menuForm, badge: e.target.value})}
                    placeholder="Contoh: Best Seller"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <label className="flex items-center space-x-3 mt-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={menuForm.isAvailable}
                      onChange={(e) => setMenuForm({...menuForm, isAvailable: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Tersedia</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Deskripsi</label>
                <textarea
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsMenuModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition">Batal</button>
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl text-sm shadow-md shadow-orange-600/20 transition">Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}