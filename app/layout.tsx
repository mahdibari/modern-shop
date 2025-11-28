// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SessionProvider } from '@/lib/SessionContext';
import { CartProvider } from '@/lib/CartContext';

// فونت وزیرمتن را از فایل محلی بارگذاری می‌کنیم
const vazirmatn = localFont({
  src: './fonts/Vazirmatn.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'بوتیک مدرن',
  description: 'بوتیکی شیک برای بانوان مدرن',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      {/* کلاس فونت را به تگ بادی اضافه می‌کنیم */}
      <body className={`${vazirmatn.className} bg-rose-100`}>
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}