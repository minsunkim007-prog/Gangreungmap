import React, { useState, useEffect, useMemo } from 'react';
import { Spot, SpotCategory, SpotRegion, ItineraryItem } from './types';
import { GANGNEUNG_SPOTS, REGIONS } from './data/spots';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { InteractiveMap } from './components/InteractiveMap';
import { SpotCard } from './components/SpotCard';
import { SpotListView } from './components/SpotListView';
import { SpotDetailModal } from './components/SpotDetailModal';
import { ItineraryDrawer } from './components/ItineraryDrawer';
import { AiPlannerModal } from './components/AiPlannerModal';
import { Compass, Sparkles, MapPin, Gift, Utensils, Navigation, ChevronRight, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'gangneung_trip_itinerary_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'itinerary'>('map');
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<SpotRegion | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected spot for modal details
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  // Itinerary items (persisted to localStorage)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // hydrate spot data to keep it fresh
        return parsed
          .map((item: any) => {
            const spot = GANGNEUNG_SPOTS.find((s) => s.id === item.spotId);
            return spot ? { ...item, spot } : null;
          })
          .filter(Boolean);
      }
    } catch {
      // ignore
    }
    // Default initial itinerary: Gangneung Sand, Yurial Yuhee, Anmok Coffee Street, Donghwa Garden
    return [
      { spotId: 'donghwa-garden', spot: GANGNEUNG_SPOTS.find((s) => s.id === 'donghwa-garden')!, order: 1 },
      { spotId: 'gangmun-beach', spot: GANGNEUNG_SPOTS.find((s) => s.id === 'gangmun-beach')!, order: 2 },
      { spotId: 'yurial-yuhee', spot: GANGNEUNG_SPOTS.find((s) => s.id === 'yurial-yuhee')!, order: 3 },
      { spotId: 'anmok-coffee-street', spot: GANGNEUNG_SPOTS.find((s) => s.id === 'anmok-coffee-street')!, order: 4 },
      { spotId: 'gangneung-sand', spot: GANGNEUNG_SPOTS.find((s) => s.id === 'gangneung-sand')!, order: 5 },
    ];
  });

  const [showRouteOnMap, setShowRouteOnMap] = useState(true);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist itinerary
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(itinerary));
    } catch {
      // ignore
    }
  }, [itinerary]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Itinerary spot IDs for fast lookup
  const itinerarySpotIds = useMemo(() => {
    return new Set(itinerary.map((i) => i.spotId));
  }, [itinerary]);

  // Counts by category
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      souvenir: 0,
      shop: 0,
      stationery: 0,
      attraction: 0,
      food: 0,
    };
    GANGNEUNG_SPOTS.forEach((spot) => {
      if (counts[spot.category] !== undefined) {
        counts[spot.category]++;
      }
    });
    return counts;
  }, []);

  // Filtered spots based on category, region, tag, and search query
  const filteredSpots = useMemo(() => {
    return GANGNEUNG_SPOTS.filter((spot) => {
      // Category filter
      if (selectedCategory !== 'all' && spot.category !== selectedCategory) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'all' && spot.region !== selectedRegion) {
        return false;
      }
      // Tag filter
      if (selectedTag && !spot.tags.includes(selectedTag)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesDesc = spot.shortDesc.toLowerCase().includes(query) || spot.fullDesc.toLowerCase().includes(query);
        const matchesRegion = spot.regionLabel.toLowerCase().includes(query);
        const matchesCategory = spot.categoryLabel.toLowerCase().includes(query);
        const matchesTag = spot.tags.some((t) => t.toLowerCase().includes(query));
        const matchesItems = spot.signatureItems?.some((item) => item.name.toLowerCase().includes(query));

        if (!matchesName && !matchesDesc && !matchesRegion && !matchesCategory && !matchesTag && !matchesItems) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedRegion, selectedTag, searchQuery]);

  // Toggle spot in itinerary
  const handleToggleItinerary = (spot: Spot, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (itinerarySpotIds.has(spot.id)) {
      setItinerary((prev) => prev.filter((item) => item.spotId !== spot.id));
      showToast(`'${spot.name}'이(가) 코스에서 삭제되었습니다.`);
    } else {
      const newItem: ItineraryItem = {
        spotId: spot.id,
        spot,
        order: itinerary.length + 1,
      };
      setItinerary((prev) => [...prev, newItem]);
      showToast(`'${spot.name}'이(가) 내 여행 코스에 추가되었습니다!`);
    }
  };

  // Reorder itinerary items
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === itinerary.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...itinerary];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // re-assign orders
    const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setItinerary(updated);
  };

  // Remove single spot
  const handleRemoveFromItinerary = (spotId: string) => {
    const spot = GANGNEUNG_SPOTS.find((s) => s.id === spotId);
    setItinerary((prev) => prev.filter((item) => item.spotId !== spotId));
    if (spot) {
      showToast(`'${spot.name}'이(가) 코스에서 삭제되었습니다.`);
    }
  };

  // Clear all
  const handleClearItinerary = () => {
    if (window.confirm('여행 코스에 담긴 모든 장소를 삭제하시겠습니까?')) {
      setItinerary([]);
      showToast('여행 코스가 초기화되었습니다.');
    }
  };

  // Load preset theme
  const handleLoadPreset = (spotIds: string[]) => {
    const items: ItineraryItem[] = [];
    spotIds.forEach((id, idx) => {
      const spot = GANGNEUNG_SPOTS.find((s) => s.id === id);
      if (spot) {
        items.push({ spotId: id, spot, order: idx + 1 });
      }
    });
    setItinerary(items);
    setActiveTab('map');
    setShowRouteOnMap(true);
    showToast('추천 테마 코스가 적용되었습니다! 지도에서 동선을 확인해 보세요.');
  };

  // Apply AI course
  const handleApplyAiCourse = (spotIds: string[]) => {
    handleLoadPreset(spotIds);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700/80 animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        itineraryCount={itinerary.length}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
      />

      {/* Category & Region & Tag Filter Bar (visible in map and list tabs) */}
      {activeTab !== 'itinerary' && (
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          countsByCategory={countsByCategory}
          totalCount={GANGNEUNG_SPOTS.length}
          filteredCount={filteredSpots.length}
        />
      )}

      {/* View Contents */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-140px)] min-h-[550px]">
            {/* Desktop Left Side Directory / Spot List */}
            <div className="w-full lg:w-[420px] xl:w-[460px] bg-white border-r border-stone-200/80 flex flex-col h-1/2 lg:h-full shrink-0 shadow-xs z-10">
              {/* Directory Top Bar */}
              <div className="p-3.5 sm:p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-stone-900">
                    추천 장소 ({filteredSpots.length})
                  </h2>
                  {searchQuery && (
                    <span className="text-xs text-stone-400">"{searchQuery}" 검색</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
                >
                  <span>그리드로 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable list of compact spot cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
                {filteredSpots.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 text-xs">
                    해당 조건의 장소가 없습니다.
                  </div>
                ) : (
                  filteredSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      onSelectSpot={(s) => setSelectedSpot(s)}
                      isInItinerary={itinerarySpotIds.has(spot.id)}
                      onToggleItinerary={handleToggleItinerary}
                      compact={true}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Main Interactive Map Area */}
            <div className="flex-1 h-1/2 lg:h-full relative">
              <InteractiveMap
                spots={filteredSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={(spot) => setSelectedSpot(spot)}
                itinerary={itinerary}
                selectedRegion={selectedRegion}
                onToggleItinerary={handleToggleItinerary}
                showItineraryRoute={showRouteOnMap}
              />
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <SpotListView
            spots={filteredSpots}
            onSelectSpot={(spot) => setSelectedSpot(spot)}
            itinerarySpotIds={itinerarySpotIds}
            onToggleItinerary={handleToggleItinerary}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryDrawer
            itinerary={itinerary}
            onRemoveFromItinerary={handleRemoveFromItinerary}
            onMoveItem={handleMoveItem}
            onClearItinerary={handleClearItinerary}
            onLoadPreset={handleLoadPreset}
            onSelectSpot={(spot) => setSelectedSpot(spot)}
            showRouteOnMap={showRouteOnMap}
            setShowRouteOnMap={setShowRouteOnMap}
            onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
          />
        )}
      </main>

      {/* Spot Detail Modal */}
      <SpotDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        isInItinerary={selectedSpot ? itinerarySpotIds.has(selectedSpot.id) : false}
        onToggleItinerary={handleToggleItinerary}
      />

      {/* AI Travel Planner Modal */}
      <AiPlannerModal
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        onApplyToItinerary={handleApplyAiCourse}
        onSelectSpot={(spot) => setSelectedSpot(spot)}
      />
    </div>
  );
}
