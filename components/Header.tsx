// components/Header.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useSession } from '@/lib/SessionContext';
import CartIcon from './CartIcon';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSession();

  return (
    <>
      <motion.header 
        className="bg-white shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-rose-600">
            بوتیک مدرن
          </Link>
          <div className="flex items-center space-x-8 space-x-reverse">
            <div className="flex space-x-6 space-x-reverse">
              <Link href="/" className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium">خانه</Link>
             
              <Link href="/contact" className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium"> تماس با ما</Link>
              {/* این لینک جدید را اضافه کردیم */}
              <Link href="/about" className="text-gray-700 hover:text-rose-500 transition-colors duration-300 font-medium">درباره ما</Link>
             
            </div>
            
            {/* منطق شرطی برای نمایش دکمه ورود یا حساب کاربری */}
            {user ? (
              <>
                <CartIcon />
                <Link 
                  href="/profile"
                  className="bg-rose-100 text-rose-600 px-4 py-2 rounded-md hover:bg-rose-200 transition-colors font-medium"
                >
                  حساب کاربری
                </Link>
              </>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition-colors font-medium"
              >
                ورود / ثبت‌نام
              </button>
            )}
          </div>
        </nav>
      </motion.header>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;