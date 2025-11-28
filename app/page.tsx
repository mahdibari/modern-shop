// app/page.tsx
import { supabase } from '@/lib/supabase';
import ShopPageClient from '@/components/ShopPageClient';

// این تابع سرور همچنان تمام محصولات را از دیتابیس می‌خواند
async function getProducts() {
  // این کوئری محصولات را به همراه تعداد لایک‌ها و بازدیدها می‌گیرد
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      likes_count,
      view_count
    `);

  if (error) {
    console.error('خطا در دریافت محصولات:', error);
    return [];
  }
  return data;
}
export default async function HomePage() {
  const products = await getProducts();

  // کل منطق و ظاهر صفحه را به کامپوننت کلاینت می‌سپاریم
  return <ShopPageClient products={products} />;
}