"use client";

import { getAppName, getAppColor } from "@/lib/apps";

interface AppData { app_key: string; devices: number; attempts: number; finished: number; correct: number; questions: number; }

export default function AppStatsTable({ data }: { data: AppData[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">アプリ別詳細</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">アプリ</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">ユーザー</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">学習回数</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">完了率</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">正答率</th>
              <th className="text-right py-2 px-3 text-gray-500 font-medium">総問題数</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => {
              const attempts = Number(app.attempts);
              const finished = Number(app.finished);
              const correct = Number(app.correct);
              const questions = Number(app.questions);
              const completionRate = attempts > 0 ? Math.round((finished / attempts) * 100) : 0;
              const correctRate = questions > 0 ? Math.round((correct / questions) * 100) : 0;
              return (
                <tr key={app.app_key} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getAppColor(app.app_key) }} /><span className="font-medium text-gray-800">{getAppName(app.app_key)}</span></div></td>
                  <td className="text-right py-3 px-3 text-gray-700">{Number(app.devices).toLocaleString()}</td>
                  <td className="text-right py-3 px-3 text-gray-700">{attempts.toLocaleString()}</td>
                  <td className="text-right py-3 px-3"><span className={`font-medium ${completionRate >= 70 ? "text-green-600" : completionRate >= 40 ? "text-yellow-600" : "text-red-500"}`}>{completionRate}%</span></td>
                  <td className="text-right py-3 px-3"><span className={`font-medium ${correctRate >= 70 ? "text-green-600" : correctRate >= 40 ? "text-yellow-600" : "text-red-500"}`}>{correctRate}%</span></td>
                  <td className="text-right py-3 px-3 text-gray-700">{questions.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
