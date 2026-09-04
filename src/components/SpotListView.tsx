import React, { useState } from 'react';
import { Spot } from '../types';
import { SpotCard } from './SpotCard';
import { ArrowUpDown, SearchX } from 'lucide-react';

interface SpotListViewProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  itinerarySpotIds: Set<string>;
  onToggleItinerary: (spot: Spot, e: React.MouseEvent) => void;
}

export const SpotListView: React.FC<SpotListViewProps> = ({
  spots,
  onSelectSpot,
  itinerarySpotIds,
  onToggleItinerary,
}) => {
  const [sortBy, setSortBy] = useState<'review' | 'rating' | 'name'>('review');

  const sortedSpots = [...spots].sort((a, b) => {
    if (sortBy === 'review') return b.reviewCount - a.reviewCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name, 'ko');
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-stone-700">
          검색 및 필터 결과 <strong className="text-teal-700">{spots.length}</strong>곳
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setSortBy('review')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                sortBy === 'review'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              인기순 (리뷰순)
            </button>
            <button
              type="button"
              onClick={() => setSortBy('rating')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                sortBy === 'rating'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              평점 높은순
            </button>
            <button
              type="button"
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                sortBy === 'name'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              가나다순
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Spots */}
      {sortedSpots.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
          <SearchX className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            조건에 맞는 장소를 찾을 수 없습니다
          </h3>
          <p className="text-xs text-stone-500">
            검색어나 선택된 지역/카테고리 필터를 변경해 보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {sortedSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onSelectSpot={onSelectSpot}
              isInItinerary={itinerarySpotIds.has(spot.id)}
              onToggleItinerary={onToggleItinerary}
            />
          ))}
        </div>
      )}
    </div>
  );
};
