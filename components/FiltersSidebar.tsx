// components/FiltersSidebar.tsx
"use client";

import { motion } from 'framer-motion';

const categories = [
  'همه',
  'کیف',
  'لباس مجلسی',
  'مانتو',
  'لباس خواب',
  'تاپ و شلوار',
];

interface FiltersSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showDiscountedOnly: boolean;
  onDiscountToggle: () => void;
  // پراپرتی‌های جدید برای مرتب‌سازی
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const FiltersSidebar = ({
  selectedCategory,
  onCategoryChange,
  showDiscountedOnly,
  onDiscountToggle,
  sortBy,
  onSortChange,
}: FiltersSidebarProps) => {
  return (
    <motion.aside 
      className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-lg h-fit"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">فیلتر محصولات</h3>
      
      {/* بخش دسته‌بندی‌ها */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4">دسته‌بندی</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="ml-2 w-4 h-4 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* بخش مرتب‌سازی (جدید) */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4">مرتب‌سازی</h4>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="none"
              checked={sortBy === 'none'}
              onChange={() => onSortChange('none')}
              className="ml-2 w-4 h-4 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-gray-600">پیش‌فرض</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="most-liked"
              checked={sortBy === 'most-liked'}
              onChange={() => onSortChange('most-liked')}
              className="ml-2 w-4 h-4 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-gray-600">مورد پسند ترین</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="bestselling"
              checked={sortBy === 'bestselling'}
              onChange={() => onSortChange('bestselling')}
              className="ml-2 w-4 h-4 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-gray-600">پرفروش ترین</span>
          </label>
        </div>
      </div>

      {/* بخش محصولات تخفیف‌خورده */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showDiscountedOnly}
            onChange={onDiscountToggle}
            className="ml-2 w-4 h-4 text-rose-600 focus:ring-rose-500"
          />
          <span className="text-gray-700 font-semibold">فقط محصولات تخفیف‌خورده</span>
        </label>
      </div>
    </motion.aside>
  );
};

export default FiltersSidebar;