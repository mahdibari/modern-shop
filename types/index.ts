// types/index.ts

// این طرح اصلی و واحد برای محصول در تمام پروژه است
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_discounted: boolean;
  likes_count: number;
  // فیلدهای جدید
  view_count: number;
  stock_quantity: number;
  material: string;
  size_guide: string;
  shipping_info: string;
}

// طرح برای نظرات
export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}