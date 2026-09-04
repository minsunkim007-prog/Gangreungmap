import React from 'react';
import { Gift, Sparkles, Compass, Utensils, MapPin, X, SlidersHorizontal, BookOpen } from 'lucide-react';
import { SpotCategory, SpotRegion } from '../types';
import { REGIONS, POPULAR_TAGS } from '../data/spots';

interface CategoryNavProps {
  selectedCategory: SpotCategory | 'all';
  onSelectCategory: (category: SpotCategory | 'all') => void;
  selectedRegion: SpotRegion | 'all';
  onSelectRegion: (region: SpotRegion | 'all') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  countsByCategory: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  selectedTag,
  onSelectTag,
  countsByCategory,
  totalCount,
  filteredCount,
}) => {
  const categories: { id: SpotCategory | 'all'; label: string; icon: React.ReactNode; colorClass: string }[] = [
    {
      id: 'all',
      label: '전체 보기',
      icon: <Compass className="w-4 h-4" />,
      colorClass: 'hover:border-stone-400 text-stone-700 active:bg-stone-100',
    },
    {
      id: 'souvenir',
      label: '기념품',
      icon: <Gift className="w-4 h-4 text-emerald-600" />,
      colorClass: 'hover:border-emerald-300 text-emerald-800',
    },
    {
      id: 'shop',
      label: '소품샵',
      icon: <Sparkles className="w-4 h-4 text-rose-500" />,
      colorClass: 'hover:border-rose-300 text-rose-800',
    },
    {
      id: 'stationery',
      label: '문구샵',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      colorClass: 'hover:border-indigo-300 text-indigo-800',
    },
    {
      id: 'food',
      label: '맛집·카페',
      icon: <Utensils className="w-4 h-4 text-amber-600" />,
      colorClass: 'hover:border-amber-300 text-amber-800',
    },
    {
      id: 'attraction',
      label: '관광지',
      icon: <MapPin className="w-4 h-4 text-sky-600" />,
      colorClass: 'hover:border-sky-300 text-sky-800',
    },
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedRegion !== 'all' || selectedTag !== null;

  const handleResetFilters = () => {
    onSelectCategory('all');
    onSelectRegion('all');
    onSelectTag(null);
  };

  return (
    <div className="bg-white border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Row 1: Primary Category Buttons */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'all' ? totalCount : (countsByCategory[cat.id] || 0);

              return (
                <button
                  key={cat.id}
                  id={`filter-category-${cat.id}`}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shrink-0 select-none ${
                    isSelected
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                      : `bg-white border-stone-200 text-stone-700 hover:bg-stone-50 ${cat.colorClass}`
                  }`}
                >
                  <span className={isSelected ? 'text-white' : ''}>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                      isSelected
                        ? 'bg-teal-900/60 text-teal-100'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reset Filters if active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 px-2 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors shrink-0"
              title="필터 초기화"
            >
              <X className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}
        </div>

        {/* Row 2: Region Filter & Tag Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold pr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>지역:</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectRegion('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              selectedRegion === 'all'
                ? 'bg-teal-100 text-teal-800 font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            전체 지역
          </button>

          {REGIONS.map((region) => (
            <button
              key={region.id}
              id={`filter-region-${region.id}`}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedRegion === region.id
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {region.label}
            </button>
          ))}

          <div className="h-4 w-px bg-stone-200 mx-1 shrink-0" />

          {/* Popular Tag Filters */}
          <div className="flex items-center gap-1.5 shrink-0">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-stone-50 text-stone-500 border border-stone-200 hover:border-stone-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-stone-400 shrink-0 font-medium pl-2">
            총 <strong className="text-teal-700">{filteredCount}</strong>곳
          </span>
        </div>
      </div>
    </div>
  );
};
