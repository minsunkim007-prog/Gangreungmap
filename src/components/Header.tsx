import React from 'react';
import { MapPin, Search, Sparkles, Navigation, ListFilter, Compass, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'list' | 'itinerary';
  setActiveTab: (tab: 'map' | 'list' | 'itinerary') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itineraryCount: number;
  onOpenAiPlanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  itineraryCount,
  onOpenAiPlanner,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('map')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-600 to-sky-700 flex items-center justify-center text-white shadow-md shadow-teal-900/10">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-sans">
                  강릉여지도
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/70">
                  강릉 로컬 가이드
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                기념품 · 소품샵 · 관광지 · 맛집 지도 & AI 여행 코스
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="search-input-header"
                type="text"
                placeholder="장소명, 기념품, 대표 메뉴, #태그 검색 (예: 샌드, 소품, 짬뽕)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-stone-100 hover:bg-stone-100/80 focus:bg-white text-sm text-stone-800 placeholder-stone-400 rounded-xl border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-semibold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Tabs & AI Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Curator Button */}
            <button
              id="btn-open-ai-planner"
              type="button"
              onClick={onOpenAiPlanner}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-97 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
              <span className="hidden sm:inline">AI 맞춤 코스</span>
              <span className="sm:hidden">AI 코스</span>
            </button>

            {/* Navigation View Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/70">
              <button
                id="tab-map-view"
                type="button"
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>지도</span>
              </button>
              <button
                id="tab-list-view"
                type="button"
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'list'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>목록</span>
              </button>
              <button
                id="tab-itinerary-view"
                type="button"
                onClick={() => setActiveTab('itinerary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                  activeTab === 'itinerary'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>내 코스</span>
                {itineraryCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                    {itineraryCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-input-mobile"
              type="text"
              placeholder="장소명, 기념품, 메뉴, #태그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-stone-100 focus:bg-white text-sm text-stone-800 placeholder-stone-400 rounded-xl border border-transparent focus:border-teal-500 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
