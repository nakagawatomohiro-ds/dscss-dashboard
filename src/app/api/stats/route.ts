import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();

    const [overviewRows, dailyRows, appRows, categoryRows, deviceRows, recentRows] = await Promise.all([
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT COUNT(DISTINCT device_id) AS total_devices,
             COUNT(*) AS total_attempts,
             COUNT(*) FILTER (WHERE status = 'finished') AS finished_attempts,
             COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_attempts,
             COALESCE(SUM(correct_count), 0) AS total_correct,
             COALESCE(SUM(total_questions), 0) AS total_answered
      FROM aa`,
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT DATE(started_at) AS date, COUNT(*) AS attempts,
             COUNT(DISTINCT device_id) AS devices,
             COALESCE(SUM(correct_count), 0) AS correct,
             COALESCE(SUM(total_questions), 0) AS questions
      FROM aa
      WHERE started_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(started_at) ORDER BY date`,
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT app_key, COUNT(DISTINCT device_id) AS devices,
             COUNT(*) AS attempts,
             COUNT(*) FILTER (WHERE status = 'finished') AS finished,
             COALESCE(SUM(correct_count), 0) AS correct,
             COALESCE(SUM(total_questions), 0) AS questions
      FROM aa GROUP BY app_key ORDER BY attempts DESC`,
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT app_key, category, COUNT(*) AS attempts,
             COALESCE(SUM(correct_count), 0) AS correct,
             COALESCE(SUM(total_questions), 0) AS questions
      FROM aa WHERE category IS NOT NULL
      GROUP BY app_key, category ORDER BY attempts DESC LIMIT 10`,
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT device_id, COUNT(*) AS total_attempts,
             COUNT(*) FILTER (WHERE status = 'finished') AS finished,
             COALESCE(SUM(correct_count), 0) AS correct,
             COALESCE(SUM(total_questions), 0) AS questions,
             MIN(started_at) AS first_access,
             MAX(started_at) AS last_access
      FROM aa GROUP BY device_id ORDER BY last_access DESC LIMIT 20`,
      sql`WITH aa AS (
        SELECT device_id, app_key, mode, category, level, status,
               total_questions, correct_count, started_at, finished_at, id
        FROM attempts
        UNION ALL
        SELECT user_id::text, 'acs', 'learn',
               'S'||stage_id||'-C'||class_id, NULL::text,
               CASE WHEN finished THEN 'finished' ELSE 'in_progress' END,
               completed_questions, score, updated_at, updated_at, id
        FROM quiz_results
      )
      SELECT id, app_key, device_id, mode, category, level, status,
             total_questions, correct_count, started_at, finished_at
      FROM aa ORDER BY started_at DESC LIMIT 20`,
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
