// app/profile/page.tsx
"use client";

import { motion } from 'framer-motion';
import { useSession } from '@/lib/SessionContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export default function ProfilePage() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!user) return;

      setLoadingLikes(true);
      // کوئری برای گرفتن محصولاتی که کاربر لایک کرده
      const { data, error } = await supabase
        .from('user_likes')
        .select(`
          products (
            id,
            name,
            image_url,
            price,
            likes_count
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('خطا در دریافت محصولات لایک شده:', error);
      } else {
        // داده‌های تو در تو را به آرایه ساده محصولات تبدیل می‌کنیم
        const products = data.map(item => item.products).filter(Boolean);
        setLikedProducts(products as Product[]);
      }

      setLoadingLikes(false);
    };

    fetchLikedProducts();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">شما وارد حساب کاربری خود نشده‌اید.</h1>
          <Link href="/" className="text-rose-600 hover:underline">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <User size={32} />
            حساب کاربری من
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">ایمیل</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <hr />

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">گزینه‌های سریع</h2>
              <div className="space-y-3">
                <Link href="#" className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors">
                  <ShoppingBag size={20} />
                  سفارش‌های من
                </Link>
                <Link href="#" className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors">
                  <Heart size={20} />
                  محصولات مورد پسند من
                </Link>
              </div>
            </div>

            <hr />

            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              خروج از حساب کاربری
            </button>
          </div>
        </motion.div>

        {/* باکس جدید و جذاب محصولات لایک شده */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart size={28} className="text-rose-500" />
            محصولات مورد پسند من
          </h2>

          {loadingLikes ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : likedProducts.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {likedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <motion.div 
                    className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* اوورلی برای نمایش نام محصول */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <p className="text-white text-xs font-semibold truncate w-full text-center">{product.name}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Heart size={48} className="mx-auto mb-4 text-gray-300" />
              شما هنوز محصولی را نپسندیده‌اید.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}