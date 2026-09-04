import { Spot, SpotRegion } from '../types';
import { SOUVENIR_SPOTS } from './spots-souvenirs';
import { SHOP_SPOTS } from './spots-shops';
import { STATIONERY_SPOTS } from './spots-stationery';
import { FOOD_SPOTS } from './spots-food';
import { ATTRACTION_SPOTS } from './spots-attractions';

export const REGIONS: { id: SpotRegion; label: string; center: [number, number]; zoom: number; desc: string }[] = [
  { id: 'anmok', label: '안목·송정', center: [37.7725, 128.9480], zoom: 15, desc: '커피거리와 울창한 해송길이 있는 동해 바다 핫플레이스' },
  { id: 'gangmun', label: '강문·경포', center: [37.7980, 128.9150], zoom: 14, desc: '포토존 바다와 경포호수, 아르떼뮤지엄이 모인 핵심 구역' },
  { id: 'chodang', label: '초당 순두부마을', center: [37.7910, 128.9140], zoom: 15, desc: '짬뽕순두부와 순두부젤라또, 감성 디저트의 메카' },
  { id: 'downtown', label: '시내·교동·중앙시장', center: [37.7580, 128.8950], zoom: 15, desc: '임영로 감성 소품샵 거리와 엽서·문구샵, 로컬 중앙시장' },
  { id: 'jumunjin', label: '주문진·향호', center: [37.8950, 128.8250], zoom: 14, desc: '도깨비 방파제와 BTS 버스정류장, 싱싱한 수산시장' },
  { id: 'jeongdongjin', label: '정동진·안인', center: [37.7000, 129.0250], zoom: 13, desc: '바다부채길과 하슬라아트월드, 끝없는 수평선 일출' },
];

export const POPULAR_TAGS = [
  '선물용포장',
  '감성소품',
  '바다뷰',
  '웨이팅핫플',
  '포토존',
  '주차편리',
  '비오는날추천',
  '반려견동반',
  '가성비'
];

export const GANGNEUNG_SPOTS: Spot[] = [
  ...SOUVENIR_SPOTS,
  ...SHOP_SPOTS,
  ...STATIONERY_SPOTS,
  ...FOOD_SPOTS,
  ...ATTRACTION_SPOTS,
];

export const PRESET_THEMES = [
  {
    id: 'theme-stationery',
    title: '강릉 감성 문구 & 소품샵 투어',
    desc: '포스트카드 오피스부터 오어즈, 라이크 어거스트, 레드망치까지 문구·다꾸 성지 순례',
    spotIds: ['postcard-office', 'like-august', 'oers-gangneung', 'red-hammer', 'sayu-space', 'whale-books'],
    duration: '오후 반나절'
  },
  {
    id: 'theme-sensory',
    title: '바다 & 감성 소품샵 투어',
    desc: '강문해변에서 유리공예를 쇼핑하고, 안목해변에서 커피 한 잔 즐기는 힐링 코스',
    spotIds: ['gangmun-beach', 'yurial-yuhee', 'maison-de-rose', 'anmok-coffee-street', 'anmok-gift-store', 'gangneung-sand-anmok'],
    duration: '당일 / 반나절'
  },
  {
    id: 'theme-foodie',
    title: '초당 미식 & 강릉 필수 기념품 정복',
    desc: '동화가든 짬순부터 툇마루 커피, 강릉샌드와 버드나무 수제맥주까지 풀코스',
    spotIds: ['donghwa-garden', 'sundubu-gelato-1', 'cafe-toemaru', 'chodang-corn-bread', 'gangneung-sand', 'budnamu-brewery'],
    duration: '1박 2일'
  },
  {
    id: 'theme-photo',
    title: '인생샷 핫플레이스 정복 코스',
    desc: 'BTS 정류장, 도깨비 방파제, 아르떼뮤지엄, 하슬라아트월드까지 사진 명소만 쏙쏙',
    spotIds: ['bts-bus-stop', 'dokkebi-breakwater', 'arte-museum', 'gangmun-beach', 'haslla-art-world'],
    duration: '1박 2일'
  },
  {
    id: 'theme-myeongju',
    title: '임영로·교동 소품 & 월화거리 산책',
    desc: '오어즈, 유라유라, 산소울 둘러보고 월화선물가게와 만동제과, 중앙시장 먹거리 탐방',
    spotIds: ['oers-gangneung', 'yurayura', 'sansoul-ceramic', 'wolhwa-gift-store', 'mandong-bakery', 'gangneung-sand'],
    duration: '반나절 / 오후'
  },
  {
    id: 'theme-jumunjin',
    title: '주문진 바다 & 수산물 미식 힐링',
    desc: 'BTS 버스정류장 인증샷, 영진해변 도깨비방파제와 주문진 생선구이 백반',
    spotIds: ['bts-bus-stop', 'silbi-fish-jumunjin', 'dokkebi-breakwater'],
    duration: '반나절'
  }
];
