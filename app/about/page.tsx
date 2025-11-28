// app/about/page.tsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, Users, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-gray-50">
      {/* بخش ۱: هدر قدرتمند و احساسی (Hero Section) */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920"
          alt="About Us Hero"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white p-6 max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              ما زیبایی را باور داریم
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow-md">
              بوتیک مدرن فقط یک فروشگاه نیست؛ یک داستان از عشق به مد، زنندگی و شکوفایی است. ما اینجا هستیم تا به شما کمک کنیم بهترین نسخه خودتان باشید.
            </p>
            <Link
              href="/"
              className="bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              کشف مجموعه ما
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* بخش ۲: داستان ما (Our Story) */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-rose-500" />
                داستان ما
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                بوتیک مدرن در سال ۱۳۹۹، با یک رویای ساده اما قدرتمند آغاز به کار کرد: "چرا انتخاب کردن لباس نباید یک تجربه لذت‌بخش و در عین حال معتبر باشد؟" ما متوجه شدیم که زنان مدرن به دنبال برندی هستند که نه تنها زیبا، بلکه هوشمندانه، راحت و قابل اعتماد باشد.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                ما با تلاش بی‌وقفه، مجموعه‌ای از محصولات دست‌نخوانه را از بهترین طراحان ایران و جهان گرد هم آوردیم تا هر زنی بتواند منحصر به فرد بودن خود را در لباسش جستجو کند.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="https://gstfafckayfftpixvifb.supabase.co/storage/v1/object/public/pic/Picsart_25-11-25_06-43-02-634.jpg"
                alt="Our Story"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* بخش ۳: ارزش‌های ما (Our Values) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ارزش‌های ما، اساس کار ماست
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ما به این اصول پایبندیم چون معتقدیم که مد باید فراتر از لباس باشد؛ باید یک احساس و یک باور باشد.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart size={40} />,
                title: "عشق به جزئیات",
                description: "هر دوخت، هر پارچه و هر طراحی با وسواس و دقت انتخاب می‌شود تا محصولی که به دست شما می‌رسد، بی‌نقص باشد."
              },
              {
                icon: <Users size={40} />,
                title: "توانمندسازی شما",
                description: "ما معتقدیم که لباس مناسب می‌تواند اعتماد به نفس شما را افزایش دهد. ماموریت ما این است که با ارائه مدل‌های شیک، این حس را به شما هدیه دهیم."
              },
              {
                icon: <Award size={40} />,
                title: "کیفیت و اصالت",
                description: "ما فقط با بهترین مواد اولیه کار می‌کنیم و منشأ تمام محصولات را تضمین می‌کنیم تا با خیال راحت خرید کنید."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-rose-500 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* بخش ۴: دعوت به همکاری (Call to Action) */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              آماده‌اید تا بخشی از داستان ما باشید؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              مجموعه ما را کاوش کنید و استایل منحصر به فرد خود را پیدا کنید. منتظر شما هستیم.
            </p>
            <Link
              href="/products"
              className="bg-white text-rose-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              خرید کنید
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}