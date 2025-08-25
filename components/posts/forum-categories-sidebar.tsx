'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LucideArrowRight, LucideBuilding2, LucideMessageSquare, LucideLoader2 } from 'lucide-react';
import { useForumCategories } from '@/lib/data/posts';

export function ForumCategoriesSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get('category');
  
  const { data: categories, isLoading, error } = useForumCategories();

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    // Update URL without page refresh
    router.push(`/posts?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
          <p className="text-sm text-gray-500 mt-1">Browse posts by community</p>
        </div>
        <div className="p-8 text-center">
          <LucideLoader2 className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
          <p className="text-sm text-gray-500 mt-1">Browse posts by community</p>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <LucideLoader2 className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Failed to load categories</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
          <p className="text-sm text-gray-500 mt-1">Browse posts by community</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
        <p className="text-sm text-gray-500 mt-1">Browse posts by community</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              selectedCategoryId === category.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {/* Category Name */}
                <div className="flex items-center space-x-2 mb-2">
                  {category.icon && (
                    <span className="text-lg">{category.icon}</span>
                  )}
                  <h3 className="font-medium text-gray-900 truncate">
                    {category.name_en}
                  </h3>
                </div>
                
                {/* Statistics */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <LucideBuilding2 className="h-4 w-4" />
                    <span>{category.organization_count.toLocaleString()}</span>
                    <span>organizations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LucideMessageSquare className="h-4 w-4" />
                    <span>{category.post_count.toLocaleString()}</span>
                    <span>posts</span>
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrow */}
              <div className="ml-3 flex-shrink-0">
                <LucideArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Show All Categories Option */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`w-full text-center py-2 px-4 rounded-md transition-colors ${
            !selectedCategoryId
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Show All Categories
        </button>
      </div>
    </div>
  );
}
