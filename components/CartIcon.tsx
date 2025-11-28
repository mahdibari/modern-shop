// components/CartIcon.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/SessionContext';
import { supabase } from '@/lib/supabase';
import { ShoppingBag } from 'lucide-react';

export default function CartIcon() {
  const { user } = useSession(); const [itemCount, setItemCount] = useState(0);
  useEffect(() => {
    const fetchItemCount = async () => {
      if (!user) return;
      const { data, error } = await supabase.rpc('get_cart_for_user');
      if (!error && data) { const count = data.reduce((sum, item) => sum + item.quantity, 0); setItemCount(count); }
    };
    fetchItemCount();
  }, [user]);
  if (!user) return null;
  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors">
      <ShoppingBag size={24} />
      {itemCount > 0 && (<span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>)}
    </Link>
  );
}