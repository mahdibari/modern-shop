// app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bookmark, Star, Send, Loader2, Package, Truck, Shield, Eye, TrendingUp } from 'lucide-react';
import { useSession } from '@/lib/SessionContext';
import { useCart } from '@/lib/CartContext';
import { Product, Review } from '@/types';


export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useSession();
  const { addItem, isAdding } = useCart(); // استفاده از هوک سبد خرید
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchData = async (productId: string) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error('خطا در دریافت محصول:', productError);
       } else {
    setProduct(productData);
    // ثبت بازدید یکتا فقط اگر کاربر لاگین کرده باشد
    if (user) {
      supabase.rpc('add_view_if_not_exists', { product_id_to_view: productId });
    }
  }

      if (user) {
        const { data: likeData } = await supabase.rpc('get_like_status', { product_id_to_check: productId });
        if (likeData && likeData.length > 0) {
          setIsLiked(likeData[0].is_liked);
        }
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating, comment, created_at')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('خطا در دریافت نظرات:', reviewsError);
      } else {
        setReviews(reviewsData || []);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchData(id);
    }
  }, [id, user]);

  const handleLike = async () => {
    if (!product || !user || isLiking) return;
    setIsLiking(true);
    const { data, error } = await supabase.rpc('toggle_like', { product_id_to_toggle: product.id });
    if (error) {
      console.error('خطا در ثبت لایک:', error);
    } else if (data && data.length > 0) {
      setIsLiked(data[0].is_liked);
      setProduct(prev => prev ? { ...prev, likes_count: data[0].new_like_count } : null);
    }
    setIsLiking(false);
  };

  const handleAddToCart = async () => {
    if (!product || !user) {
      alert('برای افزودن به سبد خرید، لطفاً وارد حساب کاربری خود شوید.');
      return;
    }
    await addItem(product.id);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-rose-600" /></div>;
  }

  if (!product) {
    return <div className="container mx-auto px-6 py-12 text-center">محصولی یافت نشد.</div>;
  }

  const isLowStock = product.stock_quantity <= 5;

  return (
    <div className="min-h-screen bg-rose-50 py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <Link href="/" className="text-rose-600 hover:underline mb-6 inline-block">
            ← بازگشت به فروشگاه
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative h-96 md:h-full">
              <Image 
                src={product.image_url} 
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-500 mb-4">{product.category}</p>
              
              {/* بخش اطلاعات کلیدی و اعتماد */}
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={handleLike} 
                  disabled={!user || isLiking}
                  className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors ${(!user || isLiking) ? 'cursor-not-allowed' : ''}`}
                >
                  {isLiking ? <Loader2 className="animate-spin" size={20} /> : <Heart fill={isLiked ? 'currentColor' : 'none'} />}
                  <span>{product.likes_count}</span>
                </button>
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye size={16} />
                  {product.view_count} بازدید
                </span>
                {isLowStock && (
                  <span className="flex items-center gap-1 text-orange-600 text-sm font-semibold animate-pulse">
                    <TrendingUp size={16} />
                    فقط {product.stock_quantity} عدد در انبار!
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
              
              <div className="text-3xl font-bold text-rose-600 mb-8">
                {product.price.toLocaleString('fa-IR')} تومان
              </div>

              <div className="relative">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="bg-rose-500 text-white text-lg font-semibold py-3 rounded-xl hover:bg-rose-600 transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="animate-spin" /> : 'افزودن به سبد خرید'}
                  <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}>✨</motion.span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* بخش جزئیات بیشتر و اعتمادسازی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">چرا این محصول را دوست خواهید داشت؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Package className="text-rose-500 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800">جنس بی‌نظیر</h3>
                <p className="text-gray-600 text-sm">{product.material || 'جنس این محصول بسیار باکیفیت و راحت است.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="text-rose-500 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800">ارسال سریع</h3>
                <p className="text-gray-600 text-sm">{product.shipping_info || 'سفارش‌ها ظرف ۲ تا ۴ روز کاری به دست شما می‌رسد.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="text-rose-500 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800">تضمین کیفیت</h3>
                <p className="text-gray-600 text-sm">اگر از خرید خود راضی نبودید، می‌توانید آن را بازگردانید.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Star className="text-rose-500 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800">رضایت کامل</h3>
                <p className="text-gray-600 text-sm">طراحی این محصول توسط بهترین طراحان انجام شده است.</p>
              </div>
            </div>
          </div>
          {product.size_guide && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">راهنمای سایز:</h4>
              <p className="text-gray-600">{product.size_guide}</p>
            </div>
          )}
        </motion.div>

        {/* بخش نظرات (بدون تغییر) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">نظرات کاربران</h2>
          <div className="p-4 bg-gray-50 rounded-lg mb-6 text-center text-gray-500">فرم ثبت نظر به زودی اضافه می‌شود...</div>
          {reviews.length > 0 ? (<div className="space-y-4">{reviews.map((review) => (<div key={review.id} className="border-b pb-4"><div className="flex items-center gap-1 mb-2">{[...Array(5)].map((_, i) => (<Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />))}</div><p className="text-gray-700">{review.comment}</p></div>))}</div>) : (<p className="text-gray-500 text-center">هنوز نظری ثبت نشده است.</p>)}
        </motion.div>
      </div>
    </div>
  );
}