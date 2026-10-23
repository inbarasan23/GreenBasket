import React, { createContext, useContext, useMemo, useState } from 'react';

import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const ShopContext = createContext(null);

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Aarav Sharma', email: 'aarav@greenbasket.in', phone: '+91 98765 43210', ordersCount: 5, totalSpent: 1240, status: 'Active', joinedDate: '12 Oct 2024' },
  { id: 'c2', name: 'Priya Patel', email: 'priya.p@gmail.com', phone: '+91 98111 22334', ordersCount: 8, totalSpent: 2890, status: 'VIP', joinedDate: '28 Sep 2024' },
  { id: 'c3', name: 'Rohan Verma', email: 'rohan.v@yahoo.com', phone: '+91 97234 56789', ordersCount: 2, totalSpent: 480, status: 'Active', joinedDate: '04 Nov 2024' },
  { id: 'c4', name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 99000 88776', ordersCount: 11, totalSpent: 4120, status: 'VIP', joinedDate: '15 Aug 2024' },
  { id: 'c5', name: 'Karthik Rao', email: 'karthik@outlook.com', phone: '+91 98450 11223', ordersCount: 1, totalSpent: 195, status: 'New', joinedDate: '22 Jan 2025' }
];

export function ShopProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

  const addProduct = (newProduct) => {
    const id = Date.now().toString();
    const created = {
      id,
      color: newProduct.color || '#EAF5E8',
      emoji: newProduct.emoji || '🥑',
      ...newProduct
    };
    setProducts(prev => [created, ...prev]);
    return created;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    setCart(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const resetDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const value = useMemo(() => ({
    user, favorites, cart, products, customers,
    signIn: setUser,
    updateUser: setUser,
    signOut: () => setUser(null),
    toggleFavorite: id => setFavorites(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]),
    addToCart: id => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })),
    removeFromCart: id => setCart(prev => {
      const next = { ...prev };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    }),
    addProduct,
    updateProduct,
    deleteProduct,
    resetDefaultProducts,
  }), [user, favorites, cart, products, customers]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}