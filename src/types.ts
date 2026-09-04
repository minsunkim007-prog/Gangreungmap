export type SpotCategory = 'souvenir' | 'shop' | 'stationery' | 'food' | 'attraction';

export type SpotRegion = 'anmok' | 'gangmun' | 'chodang' | 'downtown' | 'jumunjin' | 'jeongdongjin';

export interface SignatureItem {
  name: string;
  price?: string;
  isBest?: boolean;
  desc?: string;
}

export interface Spot {
  id: string;
  name: string;
  category: SpotCategory;
  categoryLabel: string;
  region: SpotRegion;
  regionLabel: string;
  rating: number;
  reviewCount: number;
  coordinates: [number, number]; // [lat, lng]
  address: string;
  openingHours: string;
  closedDays?: string;
  phone?: string;
  priceRange?: string;
  signatureItems: SignatureItem[];
  tips: string[];
  tags: string[];
  imageUrl: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
  isMustVisit?: boolean;
  shortDesc: string;
  fullDesc: string;
}

export interface ItineraryItem {
  spotId: string;
  spot: Spot;
  order: number;
  notes?: string;
}

export interface AiItineraryResponse {
  courseTitle: string;
  summary?: string;
  estimatedBudget?: string;
  itinerary: Array<{
    day: number;
    time: string;
    title: string;
    desc: string;
    category: 'souvenir' | 'shop' | 'attraction' | 'food';
    tip: string;
  }>;
  mustBuySouvenirs?: Array<{
    name: string;
    location: string;
    reason: string;
  }>;
  tips: string[];
  fallback?: boolean;
}
