"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { getAppName, getAppColor } from "@/lib/apps";

interface AppData { app_key: string; devices: number; attempts: number; finished: number; correct: number; questions: number; }

export default function AppComparisonChart({ data }: { data: AppData[] }) {
  const chartData = data.map((d) => ({
    name: getAppName(d.app_key), app_key: d.app_key,
    学習回数: Number(d.attempts), 完了: Number(d.finished),
    ユーザー数: Number(d.devices),
    正答率: Number(d.questions) > 0 ? Math.round((Number(d.correct) / Number(d.questions)) * 100) : 0,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">アプリ別比較</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">データがありません</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
            <Legend />
            <Bar dataKey="学習回数" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (<Cell key={entry.app_key} fill={getAppColor(entry.app_key)} />))}
            </Bar>
            <Bar dataKey="完了" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
