import React, { useState } from 'react';
import { X, Sparkles, Clock, Compass, Users, Check, ArrowRight, Lightbulb, Gift, AlertCircle, Loader2 } from 'lucide-react';
import { AiItineraryResponse, Spot } from '../types';
import { GANGNEUNG_SPOTS, REGIONS } from '../data/spots';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToItinerary: (spotIds: string[]) => void;
  onSelectSpot: (spot: Spot) => void;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  onApplyToItinerary,
  onSelectSpot,
}) => {
  const [duration, setDuration] = useState('1박 2일');
  const [companion, setCompanion] = useState('연인/커플');
  const [theme, setTheme] = useState('감성 소품샵 & 필수 기념품 투어');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    '안목·송정',
    '초당 순두부마을',
    '강문·경포',
    '시내·명주동·중앙시장',
  ]);
  const [customNotes, setCustomNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiItineraryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleArea = (label: string) => {
    if (selectedAreas.includes(label)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter((a) => a !== label));
      }
    } else {
      setSelectedAreas([...selectedAreas, label]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration,
          companion,
          theme,
          preferredAreas: selectedAreas,
          customNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AiItineraryResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Failed to generate AI course:', err);
      setErrorMsg('AI 추천 생성 중 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find matching spot IDs from AI titles to apply to itinerary
  const handleApplyCourse = () => {
    if (!result || !result.itinerary) return;

    const matchedIds: string[] = [];
    result.itinerary.forEach((item) => {
      const found = GANGNEUNG_SPOTS.find((s) =>
        item.title.includes(s.name) ||
        s.name.includes(item.title.split(' ')[0]) ||
        item.desc.includes(s.name)
      );
      if (found && !matchedIds.includes(found.id)) {
        matchedIds.push(found.id);
      }
    });

    // If no exact match found, populate with top curated spots matching theme
    if (matchedIds.length === 0) {
      matchedIds.push('gangneung-sand', 'yurial-yuhee', 'anmok-coffee-street', 'donghwa-garden', 'cafe-toemaru');
    }

    onApplyToItinerary(matchedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="ai-planner-modal"
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-teal-900 to-sky-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                AI 맞춤 강릉 여행 코스 플래너
              </h2>
              <p className="text-xs text-teal-100/80">
                내 일정과 취향에 딱 맞는 최적의 기념품·소품샵·맛집 동선 설계
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 scrollbar-thin">
          {!result ? (
            /* Input Form */
            <div className="space-y-5">
              {/* Duration */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  1. 여행 일정
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['당일치기', '1박 2일', '2박 3일'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        duration === d
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companion */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  2. 동행자
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['나 혼자 (혼행)', '연인/커플', '친구와 함께', '가족/아이/부모님'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompanion(c)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                        companion === c
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  3. 여행 테마
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    '감성 소품샵 & 필수 기념품 투어',
                    '줄서는 로컬 맛집 & 미식 탐방',
                    '동해 바다 뷰 & 인생샷 핫플레이스',
                    '자연 힐링 & 조용한 산책 코스',
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                        theme === t
                          ? 'bg-teal-50 text-teal-900 border-teal-600 font-extrabold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{t}</span>
                      {theme === t && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Areas */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  4. 포함하고 싶은 선호 지역
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => {
                    const isSelected = selectedAreas.includes(r.label);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleArea(r.label)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  5. 특별한 요청 사항 (선택)
                </label>
                <input
                  type="text"
                  placeholder="예: 뚜벅이라 버스로 이동 쉬운 곳, 비오는 날 실내 위주, 웨이팅 적은 곳..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                    <span>강릉 전문가 AI가 최적의 코스를 구성 중입니다...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>AI 맞춤 여행 코스 생성하기</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* AI Results Display */
            <div className="space-y-6">
              {/* Course Title Banner */}
              <div className="bg-gradient-to-br from-teal-50 to-sky-50 p-5 rounded-2xl border border-teal-200/80">
                <span className="text-[11px] font-black uppercase text-teal-700 tracking-wider">
                  AI 추천 맞춤 플랜
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {result.courseTitle}
                </h3>
                {result.summary && (
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {result.summary}
                  </p>
                )}
                {result.estimatedBudget && (
                  <div className="mt-3 text-xs font-bold text-teal-800 bg-white/80 px-3 py-1.5 rounded-lg inline-block border border-teal-200/50">
                    💰 예상 경비: {result.estimatedBudget}
                  </div>
                )}
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>타임라인 일정</span>
                </h4>

                <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-0.5 before:bg-stone-200">
                  {result.itinerary.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-teal-700 text-white text-[11px] font-black flex items-center justify-center shrink-0 z-10 shadow-xs ring-4 ring-white">
                        {item.day || 1}
                      </div>

                      <div className="flex-1 bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.time && (
                              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                                {item.time}
                              </span>
                            )}
                            <h5 className="text-sm font-bold text-stone-900">
                              {item.title}
                            </h5>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                          {item.desc}
                        </p>

                        {item.tip && (
                          <div className="mt-2 text-[11px] text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5 border border-amber-200/60">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{item.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Must Buy Souvenirs */}
              {result.mustBuySouvenirs && result.mustBuySouvenirs.length > 0 && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2.5">
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span>강릉 필수 쇼핑 기념품 리스트</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.mustBuySouvenirs.map((s, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200/70 text-xs">
                        <div className="font-bold text-stone-900">{s.name}</div>
                        <div className="text-[11px] text-teal-700 font-semibold">{s.location}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{s.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-teal-900 text-teal-50 space-y-2">
                  <h4 className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>강릉 여행 실전 꿀팁</span>
                  </h4>
                  <ul className="text-xs space-y-1 text-teal-100 list-disc list-inside">
                    {result.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  조건 수정하기
                </button>
                <button
                  type="button"
                  onClick={handleApplyCourse}
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>이 코스를 내 여행 코스에 적용하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
