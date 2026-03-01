"use client";

import { getAppName, getAppColor } from "@/lib/apps";

interface CategoryData { app_key: string; category: string; attempts: number; correct: number; questions: number; }

export default function CategoryStats({ data }: { data: CategoryData[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">カテゴリ別学習状況（上位10）</h3>
      <div className="space-y-3">
        {data.map((cat, i) => {
          const questions = Number(cat.questions);
          const correct = Number(cat.correct);
          const rate = questions > 0 ? Math.round((correct / questions) * 100) : 0;
          const maxAttempts = Math.max(...data.map((d) => Number(d.attempts)));
          const barWidth = (Number(cat.attempts) / maxAttempts) * 100;
          return (
            <div key={`${cat.app_key}-${cat.category}-${i}`} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getAppColor(cat.app_key) }} />
                  <span className="text-sm text-gray-700 truncate">{cat.category}</span>
                  <span className="text-xs text-gray-400 shrink-0">{getAppName(cat.app_key)}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-xs text-gray-500">{Number(cat.attempts)}回</span>
                  <span className={`text-xs font-medium ${rate >= 70 ? "text-green-600" : rate >= 40 ? "text-yellow-600" : "text-red-500"}`}>{rate}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: getAppColor(cat.app_key), opacity: 0.7 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
