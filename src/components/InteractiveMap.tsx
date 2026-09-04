import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Spot, SpotRegion, ItineraryItem } from '../types';
import { REGIONS } from '../data/spots';
import { Compass, RotateCcw, Layers, Navigation, Plus, Check } from 'lucide-react';

interface InteractiveMapProps {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
  itinerary: ItineraryItem[];
  selectedRegion: SpotRegion | 'all';
  onToggleItinerary: (spot: Spot, e?: React.MouseEvent) => void;
  showItineraryRoute?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  itinerary,
  selectedRegion,
  onToggleItinerary,
  showItineraryRoute = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [tileMode, setTileMode] = useState<'voyager' | 'osm'>('voyager');

  // Tile layers
  const tileUrl =
    tileMode === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.7725, 128.9180], // Gangneung center
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tiles = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tiles;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Tile Layer if changed
  useEffect(() => {
    if (!mapInstance.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileUrl);
  }, [tileMode]);

  // Handle Region Change
  useEffect(() => {
    if (!mapInstance.current) return;
    if (selectedRegion === 'all') {
      mapInstance.current.flyTo([37.7725, 128.9180], 12, { duration: 0.8 });
    } else {
      const regionData = REGIONS.find((r) => r.id === selectedRegion);
      if (regionData) {
        mapInstance.current.flyTo(regionData.center, regionData.zoom, { duration: 0.8 });
      }
    }
  }, [selectedRegion]);

  // Pan to selected spot
  useEffect(() => {
    if (!mapInstance.current || !selectedSpot) return;
    mapInstance.current.flyTo(selectedSpot.coordinates, 15, {
      duration: 0.6,
    });
  }, [selectedSpot]);

  // Update Markers & Itinerary Polyline
  useEffect(() => {
    if (!mapInstance.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Map itinerary order for fast lookup
    const itineraryOrderMap = new Map<string, number>();
    itinerary.forEach((item, index) => {
      itineraryOrderMap.set(item.spotId, index + 1);
    });

    spots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;
      const itineraryOrder = itineraryOrderMap.get(spot.id);

      // Icon colors by category
      let badgeColor = '#059669'; // souvenir: emerald
      let categoryEmoji = '🎁';
      if (spot.category === 'shop') {
        badgeColor = '#e11d48'; // shop: rose
        categoryEmoji = '🧸';
      } else if (spot.category === 'stationery') {
        badgeColor = '#4f46e5'; // stationery: indigo
        categoryEmoji = '📝';
      } else if (spot.category === 'attraction') {
        badgeColor = '#0284c7'; // attraction: sky
        categoryEmoji = '🌊';
      } else if (spot.category === 'food') {
        badgeColor = '#d97706'; // food: amber
        categoryEmoji = '🍲';
      }

      // Marker HTML
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-115'
        }">
          ${
            isSelected
              ? '<div class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ' +
                badgeColor +
                '"></div>'
              : ''
          }
          <div class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-lg border-2 border-white text-white font-bold text-xs" style="background-color: ${badgeColor}">
            ${
              itineraryOrder !== undefined
                ? `<span class="bg-black/40 text-white rounded-full px-1 text-[11px] font-black">${itineraryOrder}</span>`
                : `<span class="text-sm">${categoryEmoji}</span>`
            }
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-stone-900 shadow-xs border border-stone-200 pointer-events-none">
            ${spot.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-spot-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(spot.coordinates, { icon: customIcon });

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Draw route if itinerary has 2+ spots
    if (routeLayerRef.current) {
      mapInstance.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (showItineraryRoute && itinerary.length >= 2) {
      const routePoints: [number, number][] = itinerary.map(
        (item) => item.spot.coordinates
      );

      const polyline = L.polyline(routePoints, {
        color: '#0f766e',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(mapInstance.current);

      routeLayerRef.current = polyline;
    }
  }, [spots, selectedSpot, itinerary, showItineraryRoute]);

  const handleResetView = () => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo([37.7725, 128.9180], 13, { duration: 0.8 });
  };

  const toggleTileMode = () => {
    setTileMode((prev) => (prev === 'voyager' ? 'osm' : 'voyager'));
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden">
      {/* Leaflet Map Div */}
      <div id="map-container" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleResetView}
          title="강릉 전체 중심 보기"
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-stone-800 rounded-xl shadow-md border border-stone-200/80 text-xs font-bold transition-all active:scale-95 backdrop-blur-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
          <span className="hidden sm:inline">강릉 중심</span>
        </button>

        <button
          type="button"
          onClick={toggleTileMode}
          title="지도 스타일 변경"
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-stone-800 rounded-xl shadow-md border border-stone-200/80 text-xs font-bold transition-all active:scale-95 backdrop-blur-xs"
        >
          <Layers className="w-3.5 h-3.5 text-teal-700" />
          <span className="hidden sm:inline">
            {tileMode === 'voyager' ? '일반 지도' : '상세 지도'}
          </span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-stone-200/80 text-[11px] font-semibold text-stone-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>기념품</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>소품샵</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
          <span>관광지</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          <span>맛집·카페</span>
        </div>
      </div>
    </div>
  );
};
