import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CatalogContext = createContext();

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('6283875535702');
  const [adminPassword, setAdminPassword] = useState('2409');

  // Ambil data awal dan pasang listener Realtime Supabase
  useEffect(() => {
    fetchInitialData();

    // Mengaktifkan Realtime Listener agar perubahan di tab/device lain langsung sinkron seketika
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          fetchInitialData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          fetchInitialData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      // Ambil Kategori dari Supabase
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      if (!catError && catData) {
        setCategories(catData);
      }

      // Ambil Menu Makanan dari Supabase
      const { data: menuData, error: menuError } = await supabase.from('menu_items').select('*');
      if (!menuError && menuData) {
        const formattedMenu = menuData.map(item => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          badge: item.badge,
          isAvailable: item.is_available
        }));
        setMenuItems(formattedMenu);
      }
    } catch (err) {
      console.error('Gagal mengambil data dari Supabase:', err);
    }
  };

  // Fungsi Keranjang Belanja
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // Fungsi CRUD Menu dengan Supabase
  const addMenuItem = async (form) => {
    const newItem = {
      id: Date.now().toString(),
      category_id: form.categoryId,
      name: form.name,
      price: form.price,
      image: form.image,
      description: form.description,
      badge: form.badge,
      is_available: form.isAvailable
    };

    const { error } = await supabase.from('menu_items').insert([newItem]);
    if (error) {
      console.error('Gagal menambah menu:', error.message);
    } else {
      fetchInitialData();
    }
  };

  const editMenuItem = async (id, form) => {
    const updatedItem = {
      category_id: form.categoryId,
      name: form.name,
      price: form.price,
      image: form.image,
      description: form.description,
      badge: form.badge,
      is_available: form.isAvailable
    };

    const { error } = await supabase.from('menu_items').update(updatedItem).eq('id', id);
    if (error) {
      console.error('Gagal mengubah menu:', error.message);
    } else {
      fetchInitialData();
    }
  };

  const deleteMenuItem = async (id) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus menu:', error.message);
    } else {
      fetchInitialData();
    }
  };

  // Fungsi CRUD Kategori dengan Supabase
const addCategory = async (name) => {
  const newCat = { id: Date.now().toString(), name };
  const { error } = await supabase.from('categories').insert([newCat]);
  if (error) {
    console.error('Gagal menambah kategori:', error.message);
    alert('Gagal menyimpan ke database: ' + error.message); 
  } else {
    fetchInitialData();
  }
};

  const editCategory = async (id, name) => {
    const { error } = await supabase.from('categories').update({ name }).eq('id', id);
    if (error) {
      console.error('Gagal mengubah kategori:', error.message);
    } else {
      fetchInitialData();
    }
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus kategori:', error.message);
    } else {
      fetchInitialData();
    }
  };

  return (
    <CatalogContext.Provider value={{
      categories, menuItems, cart, whatsappNumber, setWhatsappNumber,
      adminPassword, setAdminPassword, addToCart, updateCartQty, removeFromCart,
      addCategory, editCategory, deleteCategory, addMenuItem, editMenuItem, deleteMenuItem
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);