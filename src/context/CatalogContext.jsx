import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCategories, initialMenuItems } from '../data/initialData';

const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fc_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('fc_menuItems');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState('customer');
  
  // Password Admin diset default ke "2409"
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('fc_adminPassword') || '2409';
  });

  // Nomor WhatsApp diset default ke "6283875535702"
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem('fc_waNumber') || '6283875535702';
  });

  useEffect(() => {
    localStorage.setItem('fc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fc_menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('fc_waNumber', whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    localStorage.setItem('fc_adminPassword', adminPassword);
  }, [adminPassword]);

  const loginAdmin = (inputPassword) => {
    if (inputPassword === adminPassword) {
      setIsAdminAuthenticated(true);
      setMode('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setMode('customer');
  };

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
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const addCategory = (name) => {
    const newCat = { id: 'cat-' + Date.now(), name };
    setCategories(prev => [...prev, newCat]);
  };

  const editCategory = (id, name) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addMenuItem = (itemData) => {
    const newItem = { id: 'item-' + Date.now(), ...itemData };
    setMenuItems(prev => [...prev, newItem]);
  };

  const editMenuItem = (id, itemData) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...itemData } : i));
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <CatalogContext.Provider value={{
      categories, menuItems, cart, mode, whatsappNumber,
      isAdminAuthenticated, adminPassword, setAdminPassword,
      loginAdmin, logoutAdmin, setMode,
      addToCart, updateCartQty, removeFromCart, clearCart,
      addCategory, editCategory, deleteCategory,
      addMenuItem, editMenuItem, deleteMenuItem
    }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => useContext(CatalogContext);