// components/ShopPageClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from './ProductCard';
import FiltersSidebar from './FiltersSidebar';
import { Product } from '@/types';
import { Star, Truck, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface ShopPageClientProps {
  products: Product[];
}

const ShopPageClient = ({ products }: ShopPageClientProps) => {
  const searchParams = useSearchParams(); // هوک برای خواندن پارامترهای URL
  const initialSort = searchParams.get('sort') || 'none'; // خواندن پارامتر sort
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('none');

  const { scrollYProgress } = useScroll();
  const translateYTitle = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'همه') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (showDiscountedOnly) {
      result = result.filter(p => p.is_discounted);
    }
    if (sortBy === 'most-liked') {
      result.sort((a, b) => b.likes_count - a.likes_count);
    } else if (sortBy === 'bestselling') {
      result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }
    return result;
  }, [products, selectedCategory, showDiscountedOnly, sortBy]);

  const bestsellers = useMemo(() => {
    return products.filter(p => p.is_bestseller).slice(0, 4);
  }, [products]);

  const newProducts = useMemo(() => {
    return products.filter(p => !p.is_bestseller).slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-rose-50">
      {/* بخش ۱: هدر بزرگ و جذاب (Hero Section) */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image 
          src="https://gstfafckayfftpixvifb.supabase.co/storage/v1/object/public/pic/Picsart_25-11-25_05-54-10-510.jpg" 
          alt="Fashion Hero"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/70 via-transparent to-transparent flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white p-6"
          >
            <motion.h1 
              style={{ translateY: translateYTitle }}
              className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            >
              زیبایی شما، هویت ما
            </motion.h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow">
             هم شیک هم راحتی
            </p>
            
          </motion.div>
        </div>
      </section>

      {/* بخش ۲: نوار اعتماد (Trust Bar) */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="text-rose-500" size={32} />
              <div>
                <h4 className="font-semibold">ارسال رایگان</h4>
                <p className="text-sm text-gray-600">برای سفارشات بالای ۵۰۰ هزار تومان</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="text-rose-500" size={32} />
              <div>
                <h4 className="font-semibold">پرداخت امن</h4>
                <p className="text-sm text-gray-600">با بهترین درگاه‌های پرداخت</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Heart className="text-rose-500" size={32} />
              <div>
                <h4 className="font-semibold">رضایت کامل</h4>
                <p className="text-sm text-gray-600">تضمین کیفیت و بازگشت کالا</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* بخش ۳: پرفروش‌ترین‌ها (Social Proof) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-rose-500" />
              مورد علاقه دیگران
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              محصولاتی که توسط خانم‌های زیادی مانند شما انتخاب و دوست داشته شده‌اند.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
  href="/?sort=bestselling" // آدرس را به صفحه اصلی با پارامتر تغییر دهید
  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center justify-center gap-2"
>
  مشاهده همه محصولات پرفروش‌ترین
  <ArrowRight size={20} />
</Link>
          </div>
        </div>
      </section>

      {/* بخش ۴: محصولات جدید و فیلترها */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8">
          <FiltersSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showDiscountedOnly={showDiscountedOnly}
            onDiscountToggle={() => setShowDiscountedOnly(!showDiscountedOnly)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="flex-1">
            <div className="relative pb-4 mb-8">
              <h1 className="text-4xl font-bold text-center text-gray-800 relative z-10 bg-rose-50 inline-block px-4">
                {showDiscountedOnly ? 'محصولات تخفیف‌خورده' : 'جدیدترین محصولات'}
              </h1>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* بخش ۵: نظرات مشتریان (Testimonials) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">چه می‌گویند؟</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نظرات مشتریان خوشحال ما، بزرگترین انگیزه ما برای ادامه دادن است.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "سارا رضایی", comment: "کیفیت پارچه‌ها فوق‌العاده است و طراحی‌ها بسیار شیک و به‌روز. از خریدم خیلی راضی هستم.", rating: 5 },
              { name: "مریم احمدی", comment: "ارسال خیلی سریع بود و بسته‌بندی محصول زیبا و محکم بود. حتماً دوباره از شما خرید می‌کنم.", rating: 5 },
              { name: "نگین حسینی", comment: "تجربه خرید عالی‌ای داشتم. پشتیبانی آنلاین بسیار پاسخگو و محترمانه بود.", rating: 4 },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                <p className="font-semibold text-gray-800">- {review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPageClient;