import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Phone, Navigation, Plus, Check, Copy, ExternalLink, Sparkles, Gift, Utensils, Lightbulb, Share2, BookOpen } from 'lucide-react';
import { Spot } from '../types';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
  isInItinerary: boolean;
  onToggleItinerary: (spot: Spot, e?: React.MouseEvent) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  isInItinerary,
  onToggleItinerary,
}) => {
  const [copied, setCopied] = useState(false);

  if (!spot) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(spot.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryInfo = (category: Spot['category']) => {
    switch (category) {
      case 'souvenir':
        return { label: '기념품', color: 'bg-emerald-500 text-white', icon: <Gift className="w-3.5 h-3.5" /> };
      case 'shop':
        return { label: '소품샵', color: 'bg-rose-500 text-white', icon: <Sparkles className="w-3.5 h-3.5" /> };
      case 'stationery':
        return { label: '문구샵', color: 'bg-indigo-500 text-white', icon: <BookOpen className="w-3.5 h-3.5" /> };
      case 'attraction':
        return { label: '관광지', color: 'bg-sky-500 text-white', icon: <MapPin className="w-3.5 h-3.5" /> };
      case 'food':
        return { label: '맛집·카페', color: 'bg-amber-500 text-white', icon: <Utensils className="w-3.5 h-3.5" /> };
    }
  };

  const catInfo = getCategoryInfo(spot.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="spot-detail-modal"
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-72 w-full bg-stone-900">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${catInfo.color}`}>
                  {catInfo.icon}
                  {catInfo.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md">
                  {spot.regionLabel}
                </span>
                {spot.isMustVisit && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 shadow-xs">
                    강릉 필수 방문
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {spot.name}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span>{spot.rating}</span>
                </div>
                <span className="text-stone-300 text-xs">
                  방문자 리뷰 {spot.reviewCount.toLocaleString()}개
                </span>
                {spot.priceRange && (
                  <>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-200 text-xs font-medium">{spot.priceRange}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                소개
              </h4>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                {spot.fullDesc}
              </p>
            </div>

            {/* Signature Items / Products */}
            {spot.signatureItems && spot.signatureItems.length > 0 && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-4 h-4 text-teal-700" />
                  <h4 className="text-sm font-bold text-stone-900">
                    {spot.category === 'souvenir'
                      ? '인기 선물 & 패키지 메뉴'
                      : spot.category === 'shop'
                      ? '시그니처 소품 & 추천 굿즈'
                      : '대표 메뉴 & 추천 체험'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {spot.signatureItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-stone-200/70 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-stone-900 text-xs sm:text-sm">
                          {item.name}
                        </div>
                        {item.isBest && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 shrink-0">
                            인기 BEST
                          </span>
                        )}
                      </div>
                      {item.desc && (
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      )}
                      {item.price && (
                        <div className="text-xs font-bold text-teal-700 mt-2 text-right">
                          {item.price}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tourist Pro Tips Box */}
            {spot.tips && spot.tips.length > 0 && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>강릉 여행자 실전 꿀팁</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-teal-950/80 list-disc list-inside">
                  {spot.tips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Essential Info List */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-stone-700">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span>{spot.address}</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? '복사됨!' : '주소 복사'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-stone-700">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span>{spot.openingHours}</span>
                  {spot.closedDays && (
                    <span className="ml-2 text-rose-600 font-medium">({spot.closedDays})</span>
                  )}
                </div>
              </div>

              {spot.phone && (
                <div className="flex items-center gap-3 text-stone-700">
                  <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{spot.phone}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {spot.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Fixed Action Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          {/* External Map Navigation Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={spot.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#03C75A] hover:bg-[#02b350] transition-colors"
            >
              <span>네이버 지도</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={spot.kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-stone-900 bg-[#FEE500] hover:bg-[#ebd300] transition-colors"
            >
              <span>카카오맵</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Toggle Itinerary Button */}
          <button
            type="button"
            onClick={() => onToggleItinerary(spot)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              isInItinerary
                ? 'bg-teal-800 text-white hover:bg-teal-900'
                : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-98'
            }`}
          >
            {isInItinerary ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>여행 코스에서 빼기</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>내 여행 코스에 담기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
