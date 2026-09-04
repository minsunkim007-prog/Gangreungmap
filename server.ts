import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Travel Course Recommendation API
app.post("/api/ai-recommend", async (req, res) => {
  try {
    const { duration, companion, theme, preferredAreas, customNotes } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: "GEMINI_API_KEY가 설정되지 않아 로컬 큐레이션 코스를 추천해 드립니다.",
        courseTitle: `[추천 코스] 강릉 ${theme || "감성 힐링"} ${duration || "1박 2일"} 여행`,
        itinerary: [
          {
            day: 1,
            time: "10:30",
            title: "강릉역 도착 & 초당 순두부 마을",
            desc: "동화가든 원조 짬순 한 그릇으로 든든하게 시작! 순두부젤라또로 입가심 후 산책.",
            category: "food",
            tip: "오전 10시 이전 테이블링 앱으로 원격 줄서기 필수!"
          },
          {
            day: 1,
            time: "13:00",
            title: "교동·임영로 감성 문구 & 소품 투어",
            desc: "포스트카드 오피스에서 감성 엽서를 쓰고, 오어즈(O'ers)와 라이크 어거스트에서 귀여운 디자인 문구와 포스터 쇼핑.",
            category: "stationery",
            tip: "오어즈와 라이크어거스트는 도보 5분 거리로 함께 둘러보기 좋습니다."
          },
          {
            day: 1,
            time: "15:30",
            title: "강문해변 & 유리알 유희",
            desc: "바다 솟대다리에서 사진을 남기고, 유리알 유희에서 핸드메이드 바다 스테인드글라스와 조개 썬캐쳐 구경.",
            category: "shop",
            tip: "오후 햇살이 유리 소품에 비칠 때 가장 예쁩니다."
          },
          {
            day: 1,
            time: "17:30",
            title: "안목해변 커피거리 & 안목선물상점",
            desc: "탁 트인 동해 바다 뷰 카페에서 커피 한 잔과 바다향 룸스프레이 쇼핑.",
            category: "attraction",
            tip: "루프탑 카페 3층 창가 자리를 추천합니다."
          },
          {
            day: 1,
            time: "19:00",
            title: "강릉 중앙시장 & 월화거리",
            desc: "강릉샌드 본점과 팡파미유 마늘빵, 배니닭강정을 사고 월화선물가게에서 마그넷 쇼핑.",
            category: "souvenir",
            tip: "중앙시장 공영주차장 또는 월화거리 공영주차장을 이용하세요."
          },
          {
            day: 2,
            time: "10:30",
            title: "아르떼뮤지엄 강릉 & 경포호수",
            desc: "몰입형 미디어아트 전시 관람 후 경포호수 자전거 산책.",
            category: "attraction",
            tip: "전시관 관람 시간은 약 1시간 30분 정도 소요됩니다."
          },
          {
            day: 2,
            time: "13:30",
            title: "고래책방 & 버드나무 브루어리",
            desc: "강릉 대형 독립서점 고래책방에서 독서노트와 문구를 둘러보고, 버드나무 브루어리에서 수제맥주 기프트세트 구매.",
            category: "stationery",
            tip: "버드나무 브루어리 미노리 세션(사천 쌀 맥주) 선물 포장 추천!"
          }
        ],
        tips: [
          "주말에는 KTX 강릉역 렌터카 예약이 빠르게 마감되니 미리 확인하세요.",
          "초당동과 안목해변 일대는 공영주차장이 마련되어 있습니다.",
          "강릉 샌드와 순두부 과자는 인기 품목이라 오후 늦게 가면 품절될 수 있습니다."
        ]
      });
    }

    const ai = getAIClient();
    const prompt = `당신은 대한민국 최고의 강릉 여행 전문 여행작가이자 로컬 큐레이터입니다.
여행객이 요청한 조건에 맞춰 가장 알차고 동선이 효율적인 강릉 여행 코스와 기념품/소품샵/문구샵/맛집 팁을 JSON 형식으로 작성해 주세요.

[요청 조건]
- 여행 일정: ${duration || "1박 2일"}
- 동행자: ${companion || "연인/친구"}
- 여행 테마: ${theme || "기념품, 감성 소품샵 & 문구샵 & 맛집 탐방"}
- 선호 지역: ${preferredAreas ? preferredAreas.join(", ") : "안목해변, 초당마을, 강릉 시내/교동/중앙시장, 강문/경포"}
- 추가 요청: ${customNotes || "동선이 꼬이지 않고 강릉 대표 먹거리와 예쁜 소품샵, 문구샵을 꼭 포함해주세요"}

반드시 순수 JSON 형식으로만 응답해야 하며, 마크다운 코드블록(\`\`\`json ...) 없이 JSON 문자열만 출력하세요.
JSON 스키마:
{
  "courseTitle": "문구로 작성된 매력적인 코스 제목",
  "summary": "코스 전체적인 특징과 콘셉트 요약 2~3문장",
  "estimatedBudget": "1인 예상 경비 대략치",
  "itinerary": [
    {
      "day": 1,
      "time": "11:00",
      "title": "방문 장소명",
      "desc": "장소에 대한 생생한 설명 및 추천 활동",
      "category": "souvenir" | "shop" | "stationery" | "attraction" | "food",
      "tip": "방문 시 꼭 알아야 할 꿀팁 (웨이팅, 주차, 추천메뉴, 인기 굿즈 등)"
    }
  ],
  "mustBuySouvenirs": [
    {
      "name": "기념품 이름",
      "location": "판매처",
      "reason": "추천 이유"
    }
  ],
  "tips": [
    "동선 및 여행 실전 꿀팁 3가지"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from AI model");
    }

    let parsed;
    try {
      // Clean possible markdown backticks if any
      const cleaned = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        courseTitle: "강릉 감성 힐링 & 맛집 코스",
        summary: text,
        itinerary: [],
        tips: ["강릉 대표 관광지를 중심으로 여행해 보세요."]
      };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("AI recommendation error:", error);
    return res.status(500).json({
      error: "AI 코스 생성 중 오류가 발생했습니다.",
      details: error?.message || "알 수 없는 오류"
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
