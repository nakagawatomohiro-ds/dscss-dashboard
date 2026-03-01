"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, subtitle, icon, color = "bg-blue-500" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
