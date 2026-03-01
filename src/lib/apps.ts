export interface AppConfig {
  key: string;
  name: string;
  shortName: string;
  color: string;
  url?: string;
}

export const APPS: AppConfig[] = [
  {
    key: "sg",
    name: "情報セキュリティマネジメント試験",
    shortName: "情報セキュマネ",
    color: "#3b82f6",
    url: "https://dscss-sg.vercel.app",
  },
  {
    key: "cs",
    name: "クラウドセキュリティ",
    shortName: "クラウドセキュリティ",
    color: "#8b5cf6",
  },
  {
    key: "ip",
    name: "ITパスポート",
    shortName: "ITパスポート",
    color: "#10b981",
  },
];

export function getAppByKey(key: string): AppConfig | undefined {
  return APPS.find((app) => app.key === key);
}

export function getAppColor(key: string): string {
  return getAppByKey(key)?.color ?? "#6b7280";
}

export function getAppName(key: string): string {
  return getAppByKey(key)?.shortName ?? key;
}
