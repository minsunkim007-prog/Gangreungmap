import React from 'react';
import { Star, MapPin, Plus, Check, ExternalLink, Sparkles, Gift, Utensils, BookOpen } from 'lucide-react';
import { Spot } from '../types';

interface SpotCardProps {
  spot: Spot;
  onSelectSpot: (spot: Spot) => void;
  isInItinerary: boolean;
  onToggleItinerary: (spot: Spot, e: React.MouseEvent) => void;
  compact?: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  onSelectSpot,
  isInItinerary,
  onToggleItinerary,
  compact = false,
}) => {
  const getCategoryBadge = (category: Spot['category']) => {
    switch (category) {
      case 'souvenir':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Gift className="w-3 h-3" />,
          label: '기념품',
        };
      case 'shop':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <Sparkles className="w-3 h-3" />,
          label: '소품샵',
        };
      case 'stationery':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <BookOpen className="w-3 h-3" />,
          label: '문구샵',
        };
      case 'attraction':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <MapPin className="w-3 h-3" />,
          label: '관광지',
        };
      case 'food':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Utensils className="w-3 h-3" />,
          label: '맛집·카페',
        };
    }
  };

  const badge = getCategoryBadge(spot.category);

  if (compact) {
    return (
      <div
        id={`spot-card-compact-${spot.id}`}
        onClick={() => onSelectSpot(spot)}
        className="group flex gap-3 p-2.5 bg-white hover:bg-stone-50/80 rounded-xl border border-stone-200 hover:border-teal-400 transition-all cursor-pointer relative"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
          <img
            src={spot.imageUrl}
            alt={spot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-teal-700 transition-colors">
                {spot.name}
              </h3>
              <div className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{spot.rating}</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{spot.shortDesc}</p>
          </div>

          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-stone-400 truncate max-w-[120px]">{spot.regionLabel}</span>
            <button
              type="button"
              onClick={(e) => onToggleItinerary(spot, e)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold transition-all ${
                isInItinerary
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-teal-50 text-stone-600 hover:text-teal-700'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>담김</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>담기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`spot-card-${spot.id}`}
      onClick={() => onSelectSpot(spot)}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-teal-500/80 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Image Banner */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
          <img
            src={spot.imageUrl}
            alt={spot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${badge.bg}`}>
              {badge.icon}
              <span>{badge.label}</span>
            </span>
            {spot.isMustVisit && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500 text-white tracking-tight shadow-xs">
                강릉 필수
              </span>
            )}
          </div>

          {/* Region and Rating bottom overlay */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {spot.regionLabel}
            </span>
            <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md font-bold text-amber-300 backdrop-blur-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{spot.rating}</span>
              <span className="text-stone-300 font-normal text-[10px]">({spot.reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
              {spot.name}
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
              {spot.shortDesc}
            </p>
          </div>

          {/* Signature item highlights */}
          {spot.signatureItems && spot.signatureItems.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-2 text-xs border border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 block mb-1">
                {spot.category === 'souvenir' ? '🎁 인기 기념품' : spot.category === 'shop' ? '✨ 대표 소품' : '⭐️ 시그니처'}
              </span>
              <div className="space-y-0.5">
                {spot.signatureItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-stone-800">
                    <span className="truncate font-medium text-[11px]">· {item.name}</span>
                    {item.price && (
                      <span className="text-[11px] text-teal-700 font-semibold shrink-0 ml-1">
                        {item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {spot.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-1">
        <span className="text-xs text-stone-400 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{spot.address.split(' ').slice(1, 3).join(' ')}</span>
        </span>

        <button
          type="button"
          onClick={(e) => onToggleItinerary(spot, e)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
            isInItinerary
              ? 'bg-teal-700 text-white hover:bg-teal-800'
              : 'bg-stone-100 text-stone-700 hover:bg-teal-50 hover:text-teal-800'
          }`}
        >
          {isInItinerary ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>코스 담김</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>코스에 담기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
