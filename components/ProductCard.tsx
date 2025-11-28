// components/ProductCard.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types';

const ProductCard = ({ product }: { product: Product }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative"
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative h-64 w-full">
        <Image 
          src={product.image_url} 
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
        
        {/* باکس جدید و شیک تعداد لایک‌ها روی تصویر */}
        <motion.div 
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Heart size={16} className="text-rose-500" fill="currentColor" />
          {product.likes_count || 0}
        </motion.div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        
        {/* بخش توضیحات متحرک */}
        <div className="mb-4">
          <AnimatePresence>
            {isDescriptionOpen && (
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {product.description}
              </motion.p>
            )}
          </AnimatePresence>
          <button
            onClick={toggleDescription}
            className="flex items-center gap-2 text-rose-600 text-sm font-medium border border-rose-300 rounded-full px-3 py-1 hover:bg-rose-50 transition-colors"
          >
            {isDescriptionOpen ? 'بستن' : 'توضیحات'}
            <motion.span
              animate={{ rotate: isDescriptionOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </button>
        </div>

        <div className="flex justify-between items-center">
          {/* قیمت در کنار دکمه، بدون لایک */}
          <span className="text-2xl font-bold text-rose-600">
            {product.price.toLocaleString('fa-IR')} تومان
          </span>
          
          <Link 
            href={`/products/${product.id}`}
            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition-colors flex items-center gap-2"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </motion.svg>
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;