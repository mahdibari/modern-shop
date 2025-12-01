// app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bookmark, Star, Send, Loader2, Package, Truck, Shield, Eye, TrendingUp, Reply } from 'lucide-react';
import { useSession } from '@/lib/SessionContext';
import { useCart } from '@/lib/CartContext';
import AuthModal from '@/components/AuthModal'; // اضافه کردن این خط

// تعریف تایپ Review در اینجا اگر فایل types.ts ندارید
interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number | null;
  comment: string;
  status: 'pending' | 'approved';
  created_at: string;
  parent_id: string | null;
  replies?: Review[];
}

// تعریف تایپ Product
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  likes_count: number;
  view_count: number;
  material?: string;
  shipping_info?: string;
  size_guide?: string;
}

// کامپوننت بازگشتی برای نمایش نظرات و پاسخ‌ها
const CommentThread: React.FC<{ review: Review }> = ({ review }) => {
  const isAdminReply = review.parent_id !== null;
  
  return (
    <div className={`${isAdminReply ? 'mr-8 mt-3 p-4 bg-gray-50 rounded-lg border-r-4 border-rose-300' : ''}`}>
      <div className="flex items-center gap-1 mb-2">
        {review.rating !== null && [...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
        ))}
        {isAdminReply && <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-1 rounded">پاسخ ادمین</span>}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
      <p className="text-gray-400 text-xs mt-2">
        {new Date(review.created_at).toLocaleDateString('fa-IR')}
      </p>
      {/* نمایش پاسخ‌های این نظر */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {review.replies.map(reply => (
            <CommentThread key={reply.id} review={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useSession();
  const { addItem, isAdding } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  // State for review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  // اضافه کردن state برای کنترل مودال احراز هویت
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async (productId: string) => {
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

      // واکشی تمام نظرات تایید شده (شامل پاسخ‌ها)
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*') // همه ستون‌ها را انتخاب می‌کنیم
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true }); // ترتیب زمانی صعودی برای ساختار درختی

      if (reviewsError) {
        console.error('خطا در دریافت نظرات:', reviewsError);
        setReviews([]);
      } else {
        // تبدیل آرایه مسطح به ساختار درختی
        const nestComments = (comments: Review[]): Review[] => {
          const commentMap: { [key: string]: Review } = {};
          const roots: Review[] = [];

          // ابتدا همه کامنت‌ها را در یک مپ قرار می‌دهیم
          comments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
          });

          // سپس کامنت‌ها را به والدینشان متصل می‌کنیم
          comments.forEach(comment => {
            if (comment.parent_id === null) {
              roots.push(commentMap[comment.id]);
            } else {
              const parent = commentMap[comment.parent_id];
              if (parent) {
                parent.replies!.push(commentMap[comment.id]);
              }
            }
          });
          return roots;
        };

        setReviews(nestComments(reviewsData || []));
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
      // به جای alert، مودال ورود را باز می‌کنیم
      setIsAuthModalOpen(true);
      return;
    }
    await addItem(product.id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      // اگر کاربر لاگین نکرده باشد، مودال ورود را باز می‌کنیم
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!product || reviewRating === 0 || reviewComment.trim() === '') {
      alert('لطفاً تمام فیلدها را با دقت پر کنید و امتیاز را انتخاب نمایید.');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating: reviewRating,
          comment: reviewComment.trim(),
          status: 'pending',
          parent_id: null // نظرات کاربران همیشه والد هستند
        });
      
      if (error) {
        console.error('خطا در ثبت نظر:', error);
        alert(`خطایی در ثبت نظر شما رخ داد: ${error.message || 'لطفاً دوباره تلاش کنید.'}`);
      } else {
        setReviewRating(0);
        setReviewComment('');
        setReviewSubmitted(true);
        setTimeout(() => setReviewSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Caught an unexpected error:', error);
      alert('خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmittingReview(false);
    }
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
        {/* ... بخش‌های قبلی محصول (تصویر، قیمت، دکمه افزودن به سبد خرید) ... */}
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

        {/* بخش نظرات به‌روز شده */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">نظرات کاربران</h2>
          
          {user ? (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ثبت نظر شما</h3>
              {reviewSubmitted && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  نظر شما با موفقیت ثبت شد و پس از تایید مدیر نمایش داده خواهد شد.
                </div>
              )}
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">امتیاز شما:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className="focus:outline-none">
                        <Star size={24} className={star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-gray-700 mb-2">نظر شما:</label>
                  <textarea id="comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500" placeholder="نظر خود را در مورد این محصول بنویسید..."></textarea>
                </div>
                <button type="submit" disabled={isSubmittingReview || reviewRating === 0 || reviewComment.trim() === ''} className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSubmittingReview ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  ثبت نظر
                </button>
              </form>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
              برای ثبت نظر، لطفاً 
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="text-blue-600 underline hover:text-blue-800 mx-1"
              >
                وارد حساب کاربری خود شوید
              </button>
              .
            </div>
          )}
          
          {/* نمایش نظرات و پاسخ‌ها به صورت درختی */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <CommentThread key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">هنوز نظری ثبت نشده است.</p>
          )}
        </motion.div>
      </div>
      
      {/* اضافه کردن مودال احراز هویت */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}