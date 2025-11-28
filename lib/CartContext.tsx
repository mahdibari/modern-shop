// lib/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from './SessionContext';
import { supabase } from './supabase';
import { Product } from '@/types';

export interface CartItem extends Product {
  item_id: bigint;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  addItem: (productId: bigint, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: bigint, newQuantity: number) => Promise<void>;
  removeItem: (itemId: bigint) => Promise<void>;
  isAdding: boolean;
  updatingItemId: bigint | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<bigint | null>(null);

  // تابع fetchCart اکنون در سطح بالاتری تعریف شده است
  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    const { data, error } = await supabase.rpc('get_cart_for_user');
    if (error) {
      console.error('خطا در دریافت سبد خرید:', error);
    } else {
      setCartItems(data || []);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId: bigint, quantity = 1) => {
    if (!user) return;
    setIsAdding(true);
    const { error } = await supabase.rpc('add_to_cart', {
      product_id_to_add: productId,
      quantity_to_add: quantity,
    });
    if (error) {
      console.error('خطا در افزودن به سبد خرید:', error);
      alert('خطایی در افزودن محصول به سبد خرید رخ داد.');
    } else {
      alert('محصول با موفقیت به سبد خرید اضافه شد!');
      fetchCart(); // حالا می‌توانیم با خیال راحت fetchCart را فراخوانی کنیم
    }
    setIsAdding(false);
  };

  const updateQuantity = async (itemId: bigint, newQuantity: number) => {
    if (!user) return;
    setUpdatingItemId(itemId);
    const { error } = await supabase.rpc('update_cart_quantity', {
      item_id_to_update: itemId,
      new_quantity: newQuantity,
    });
    if (error) {
      console.error('خطا در آپدیت تعداد:', error);
    } else {
      setCartItems(prev => prev.map(item => 
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0));
    }
    setUpdatingItemId(null);
  };

  const removeItem = async (itemId: bigint) => {
    if (!user) return;
    setUpdatingItemId(itemId);
    const { error } = await supabase.rpc('remove_from_cart', {
      item_id_to_remove: itemId,
    });
    if (error) {
      console.error('خطا در حذف محصول:', error);
    } else {
      setCartItems(prev => prev.filter(item => item.item_id !== itemId));
    }
    setUpdatingItemId(null);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    isAdding,
    updatingItemId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}