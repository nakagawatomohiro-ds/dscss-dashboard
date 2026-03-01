"use client";

import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { getAppName, getAppColor } from "@/lib/apps";

interface Attempt { id: string; app_key: string; device_id: string; mode: string; category: string | null; level: number | null; status: string; total_questions: number; correct_count: number; started_at: string; finished_at: string | null; }

const MODE_LABELS: Record<string, string> = { learn: "学習", mock: "模試", wrong: "間違い復習" };
const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  finished: { label: "完了", className: "bg-green-100 text-green-700" },
  in_progress: { label: "進行中", className: "bg-blue-100 text-blue-700" },
  abandoned: { label: "中断", className: "bg-gray-100 text-gray-500" },
};

export default function RecentAttempts({ data }: { data: Attempt[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">最近の学習</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">日時</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">アプリ</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">モード</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">カテゴリ</th>
              <th className="text-center py-2 px-3 text-gray-500 font-medium">ステータス</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">正答</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">デバイス</th>
            </tr>
          </thead>
          <tbody>
            {data.map((attempt) => {
              const status = STATUS_LABELS[attempt.status] || { label: attempt.status, className: "bg-gray-100 text-gray-500" };
              const total = Number(attempt.total_questions);
              const correct = Number(attempt.correct_count);
              return (
                <tr key={attempt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{format(parseISO(attempt.started_at), "M/d HH:mm", { locale: ja })}</td>
                  <td className="py-2.5 px-3"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getAppColor(attempt.app_key) }} /><span className="text-gray-800">{getAppName(attempt.app_key)}</span></div></td>
                  <td className="py-2.5 px-3 text-gray-600">{MODE_LABELS[attempt.mode] || attempt.mode}</td>
                  <td className="py-2.5 px-3 text-gray-600 max-w-[150px] truncate">{attempt.category || "-"}{attempt.level ? ` Lv.${attempt.level}` : ""}</td>
                  <td className="py-2.5 px-3 text-center"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span></td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{total > 0 ? `${correct}/${total}` : "-"}</td>
                  <td className="py-2.5 px-3 text-gray-400 text-xs font-mono">{attempt.device_id.slice(0, 8)}...</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
