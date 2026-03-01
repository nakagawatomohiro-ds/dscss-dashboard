"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

interface DailyData { date: string; attempts: number; devices: number; correct: number; questions: number; }

export default function DailyChart({ data }: { data: DailyData[] }) {
  const chartData = data.map((d) => ({
    ...d, label: format(parseISO(d.date), "M/d", { locale: ja }),
    rate: Number(d.questions) > 0 ? Math.round((Number(d.correct) / Number(d.questions)) * 100) : 0,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">直近30日間のアクティビティ</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">データがありません</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = { attempts: "学習回数", devices: "ユーザー数" };
                return [value, labels[name] || name];
              }} />
            <Legend formatter={(value: string) => {
              const labels: Record<string, string> = { attempts: "学習回数", devices: "ユーザー数" };
              return labels[value] || value;
            }} />
            <Area type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAttempts)" />
            <Area type="monotone" dataKey="devices" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDevices)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
