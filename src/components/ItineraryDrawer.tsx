import React, { useState } from 'react';
import { Spot, ItineraryItem } from '../types';
import { PRESET_THEMES, GANGNEUNG_SPOTS } from '../data/spots';
import { ArrowUp, ArrowDown, Trash2, Share2, Sparkles, Navigation, MapPin, Check, Plus, ExternalLink } from 'lucide-react';

interface ItineraryDrawerProps {
  itinerary: ItineraryItem[];
  onRemoveFromItinerary: (spotId: string) => void;
  onMoveItem: (index: number, direction: 'up' | 'down') => void;
  onClearItinerary: () => void;
  onLoadPreset: (spotIds: string[]) => void;
  onSelectSpot: (spot: Spot) => void;
  showRouteOnMap: boolean;
  setShowRouteOnMap: (show: boolean) => void;
  onOpenAiPlanner: () => void;
}

export const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
  itinerary,
  onRemoveFromItinerary,
  onMoveItem,
  onClearItinerary,
  onLoadPreset,
  onSelectSpot,
  showRouteOnMap,
  setShowRouteOnMap,
  onOpenAiPlanner,
}) => {
  const [copied, setCopied] = useState(false);

  // Approximate distance calculation between sequential points
  const calculateTotalDistance = (): string => {
    if (itinerary.length < 2) return '0';
    let total = 0;
    for (let i = 0; i < itinerary.length - 1; i++) {
      const [lat1, lon1] = itinerary[i].spot.coordinates;
      const [lat2, lon2] = itinerary[i + 1].spot.coordinates;
      // Haversine formula approximation
      const R = 6371; // km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return total.toFixed(1);
  };

  const handleShareItinerary = () => {
    if (itinerary.length === 0) return;
    const text = `🌊 강릉여지도 - 나만의 강릉 여행 코스\n\n` +
      itinerary
        .map(
          (item, idx) =>
            `${idx + 1}. [${item.spot.categoryLabel}] ${item.spot.name} (${item.spot.regionLabel})\n   - 위치: ${item.spot.address}`
        )
        .join('\n\n') +
      `\n\n총 ${itinerary.length}개 장소 (예상 이동 약 ${calculateTotalDistance()}km)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Stats */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Navigation className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              나만의 강릉 여행 코스
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            담아둔 강릉 명소를 원하는 순서대로 배치하고 한눈에 동선을 확인하세요.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200/80 text-right">
            <div className="text-[11px] font-bold text-stone-400">총 장소</div>
            <div className="text-base font-black text-teal-700">
              {itinerary.length}곳
            </div>
          </div>
          <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200/80 text-right">
            <div className="text-[11px] font-bold text-stone-400">예상 이동거리</div>
            <div className="text-base font-black text-stone-900">
              약 {calculateTotalDistance()} km
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRouteOnMap(!showRouteOnMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showRouteOnMap
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>지도에 이동 동선 연결선 {showRouteOnMap ? '켜짐' : '켜기'}</span>
          </button>

          {itinerary.length > 0 && (
            <button
              type="button"
              onClick={handleShareItinerary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? '코스 복사 완료!' : '코스 텍스트 복사'}</span>
            </button>
          )}
        </div>

        {itinerary.length > 0 && (
          <button
            type="button"
            onClick={onClearItinerary}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>전체 비우기</span>
          </button>
        )}
      </div>

      {/* Itinerary List */}
      {itinerary.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-dashed border-stone-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
            <Navigation className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-800">
              아직 코스에 담긴 장소가 없습니다
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
              지도나 목록에서 마음에 드는 기념품점, 소품샵, 맛집의 <strong>‘+ 코스에 담기’</strong> 버튼을 눌러보세요.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenAiPlanner}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>AI 추천 코스로 자동 생성하기</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {itinerary.map((item, index) => {
            const spot = item.spot;
            return (
              <div
                key={item.spotId}
                className="group bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-teal-400 transition-all flex items-center gap-3 sm:gap-4"
              >
                {/* Step Index Number */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {index + 1}
                </div>

                {/* Spot Thumbnail */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100 cursor-pointer"
                  onClick={() => onSelectSpot(spot)}
                >
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Spot Details */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelectSpot(spot)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {spot.categoryLabel}
                    </span>
                    <span className="text-[11px] text-stone-400 truncate">
                      {spot.regionLabel}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate mt-0.5 group-hover:text-teal-700 transition-colors">
                    {spot.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {spot.shortDesc}
                  </p>
                </div>

                {/* Reordering and Delete Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveItem(index, 'up')}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="위로 이동"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === itinerary.length - 1}
                    onClick={() => onMoveItem(index, 'down')}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="아래로 이동"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFromItinerary(item.spotId)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                    title="코스에서 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Curated Preset Themes Section */}
      <div className="pt-6 border-t border-stone-200">
        <div className="mb-4">
          <h3 className="text-base font-bold text-stone-900">
            강릉 로컬 추천 테마 코스
          </h3>
          <p className="text-xs text-stone-500">
            원클릭으로 검증된 동선의 추천 코스를 불러와 내 코스에 적용할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_THEMES.map((theme) => (
            <div
              key={theme.id}
              className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                    {theme.duration}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {theme.spotIds.length}개 스팟
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{theme.title}</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {theme.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onLoadPreset(theme.spotIds)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-teal-50 text-stone-700 hover:text-teal-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>이 테마 코스 불러오기</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
