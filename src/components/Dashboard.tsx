"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "./StatCard";
import DailyChart from "./DailyChart";
import AppComparisonChart from "./AppComparisonChart";
import AppStatsTable from "./AppStatsTable";
import RecentAttempts from "./RecentAttempts";
import CategoryStats from "./CategoryStats";

interface StatsData {
  overview: { total_devices: number; total_attempts: number; finished_attempts: number; in_progress_attempts: number; total_correct: number; total_answered: number; };
  daily: Array<{ date: string; attempts: number; devices: number; correct: number; questions: number; }>;
  apps: Array<{ app_key: string; devices: number; attempts: number; finished: number; correct: number; questions: number; }>;
  categories: Array<{ app_key: string; category: string; attempts: number; correct: number; questions: number; }>;
  devices: Array<Record<string, unknown>>;
  recent: Array<{ id: string; app_key: string; device_id: string; mode: string; category: string | null; level: number | null; status: string; total_questions: number; correct_count: number; started_at: string; finished_at: string | null; }>;
}

export default function Dashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-500 text-sm">読み込み中...</p></div></div>);
  }
  if (error && !data) {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><p className="text-red-500 mb-3">{error}</p><button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">再試行</button></div></div>);
  }
  if (!data) return null;

  const { overview } = data;
  const totalAnswered = Number(overview.total_answered);
  const totalCorrect = Number(overview.total_correct);
  const overallRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">DSCSS ダッシュボード</h1><p className="text-xs text-gray-400 mt-0.5">学習アプリ使用状況</p></div>
          <div className="flex items-center gap-3">
            {lastUpdated && (<span className="text-xs text-gray-400">最終更新: {lastUpdated.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span>)}
            <button onClick={fetchData} disabled={loading} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors disabled:opacity-50">{loading ? "更新中..." : "更新"}</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="総ユーザー数" value={Number(overview.total_devices).toLocaleString()} icon="👥" color="bg-blue-500" subtitle="デバイス数ベース" />
          <StatCard title="総学習回数" value={Number(overview.total_attempts).toLocaleString()} icon="📝" color="bg-purple-500" subtitle={`完了: ${Number(overview.finished_attempts).toLocaleString()}`} />
          <StatCard title="総回答数" value={totalAnswered.toLocaleString()} icon="✅" color="bg-green-500" subtitle={`正解: ${totalCorrect.toLocaleString()}`} />
          <StatCard title="全体正答率" value={`${overallRate}%`} icon="📊" color="bg-amber-500" subtitle={`${totalCorrect} / ${totalAnswered}`} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6"><DailyChart data={data.daily} /><AppComparisonChart data={data.apps} /></div>
        <div className="grid lg:grid-cols-2 gap-6"><AppStatsTable data={data.apps} /><CategoryStats data={data.categories} /></div>
        <RecentAttempts data={data.recent} />
      </main>
    </div>
  );
}
