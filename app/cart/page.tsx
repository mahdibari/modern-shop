// app/cart/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/lib/SessionContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Minus, Plus, Trash2, Loader2, ShoppingBag, Truck, Shield, CreditCard, Tag, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface CartItem {
  item_id: bigint;
  product_id: bigint;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const { user } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<bigint | null>(null);
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase.rpc('get_cart_for_user');
      if (error) {
        console.error('خطا در دریافت سبد خرید:', error);
      } else {
        setCartItems(data || []);
      }
      setLoading(false);
    };
    fetchCart();
  }, [user]);

  const handleQuantityChange = async (itemId: bigint, newQuantity: number) => {
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

  const handleRemoveItem = async (itemId: bigint) => {
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const shippingCost = calculateSubtotal() > 500000 ? 0 : 30000; // ارسال رایگان بالای ۵۰۰ هزار تومان
  const discount = 0; // در آینده می‌توانید منطق کد تخفیف را اضافه کنید
  const total = calculateSubtotal() + shippingCost - discount;
  const isFreeShipping = calculateSubtotal() > 500000;

  if (!user) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">برای دیدن سبد خرید، وارد شوید.</h1>
          <p className="text-gray-600 mb-6">و از دنیای خریدهای لذت‌بخش لذت ببرید.</p>
          <Link href="/" className="text-rose-600 hover:underline font-semibold">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-rose-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* بخش ۱: هوشمندانه و دلنشین */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            سبد خرید شما آماده است!
          </h1>
          <p className="text-lg text-gray-600">
            انتخاب‌های بی‌نظیری برای شما آماده کرده‌ایم. برای تکمیل خرید فقط چند قدم مانده.
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl shadow-xl"
          >
            <Gift size={80} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">سبد خرید شما خالی است!</h2>
            <p className="text-gray-500 mb-8">بیایید با چند محصول جدید، سبد شما را پر کنیم.</p>
            <Link href="/" className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors font-semibold shadow-lg hover:shadow-xl">
              بازگشت به فروشگاه
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* بخش ۲: لیست محصولات در سبد */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.item_id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-6"
                  >
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-rose-600 font-bold text-lg mb-4">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.item_id, item.quantity - 1)}
                          disabled={updatingItemId === item.item_id}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.item_id, item.quantity + 1)}
                          disabled={updatingItemId === item.item_id}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.item_id)}
                      disabled={updatingItemId === item.item_id}
                      className="text-red-400 hover:text-red-600 p-2 disabled:opacity-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* بخش ۳: خلاصه سفارش و دکمه پرداخت (مهم‌ترین بخش) */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-xl h-fit sticky top-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">خلاصه سفارش</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>جمع کالا</span>
                    <span>{calculateSubtotal().toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>هزینه ارسال</span>
                    <span>{isFreeShipping ? 'رایگان' : shippingCost.toLocaleString('fa-IR') + ' تومان'}</span>
                  </div>
                  {!isFreeShipping && (
                    <p className="text-sm text-rose-600 text-center bg-rose-50 p-2 rounded-lg">
                      فقط با {(500000 - calculateSubtotal()).toLocaleString('fa-IR')} تومان دیگر، ارسال برای شما رایگان می‌شود!
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>مجموع:</span>
                      <span>{total.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                </div>

                {/* بخش کد تخفیف */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Tag size={20} />
                    کد تخفیف دارید؟
                  </label>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد را وارد کنید"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* بخش اطمینان‌بخشی */}
                <div className="space-y-3 mb-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="text-green-500" size={18} />
                    <span>پرداخت امن و رمزنگاری شده</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="text-blue-500" size={18} />
                    <span>ارسال سریع و مطمئن</span>
                  </div>
                </div>

                {/* دکمه اصلی و جذاب پرداخت */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <CreditCard size={24} />
                  تکمیل خرید و پرداخت
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}