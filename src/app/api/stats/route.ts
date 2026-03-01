import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();

    const [overviewRows, dailyRows, appRows, categoryRows, deviceRows, recentRows] = await Promise.all([
      sql`SELECT COUNT(DISTINCT device_id) AS total_devices, COUNT(*) AS total_attempts, COUNT(*) FILTER (WHERE status = 'finished') AS finished_attempts, COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_attempts, COALESCE(SUM(correct_count), 0) AS total_correct, COALESCE(SUM(total_questions), 0) AS total_answered FROM attempts`,
      sql`SELECT DATE(started_at) AS date, COUNT(*) AS attempts, COUNT(DISTINCT device_id) AS devices, COALESCE(SUM(correct_count), 0) AS correct, COALESCE(SUM(total_questions), 0) AS questions FROM attempts WHERE started_at >= NOW() - INTERVAL '30 days' GROUP BY DATE(started_at) ORDER BY date`,
      sql`SELECT app_key, COUNT(DISTINCT device_id) AS devices, COUNT(*) AS attempts, COUNT(*) FILTER (WHERE status = 'finished') AS finished, COALESCE(SUM(correct_count), 0) AS correct, COALESCE(SUM(total_questions), 0) AS questions FROM attempts GROUP BY app_key ORDER BY attempts DESC`,
      sql`SELECT app_key, category, COUNT(*) AS attempts, COALESCE(SUM(correct_count), 0) AS correct, COALESCE(SUM(total_questions), 0) AS questions FROM attempts WHERE category IS NOT NULL GROUP BY app_key, category ORDER BY attempts DESC LIMIT 10`,
      sql`SELECT device_id, COUNT(*) AS total_attempts, COUNT(*) FILTER (WHERE status = 'finished') AS finished, COALESCE(SUM(correct_count), 0) AS correct, COALESCE(SUM(total_questions), 0) AS questions, MIN(started_at) AS first_access, MAX(started_at) AS last_access FROM attempts GROUP BY device_id ORDER BY last_access DESC LIMIT 20`,
      sql`SELECT a.id, a.app_key, a.device_id, a.mode, a.category, a.level, a.status, a.total_questions, a.correct_count, a.started_at, a.finished_at FROM attempts a ORDER BY a.started_at DESC LIMIT 20`,
    ]);

    return NextResponse.json({
      overview: overviewRows[0],
      daily: dailyRows,
      apps: appRows,
      categories: categoryRows,
      devices: deviceRows,
      recent: recentRows,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
