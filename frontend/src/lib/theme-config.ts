export type ThemeId =
  | "brewhouse"
  | "royal_navy"
  | "emerald_luxury"
  | "black_gold"
  | "midnight_purple"
  | "rose_platinum";

export interface ThemeColors {
  primary: string;
  sidebar: string;
  background: string;
  surface: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarActiveIcon: string;
  input: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  category: string;
  colors: ThemeColors;
}

export const STORAGE_KEY = "brewhouse-theme";
export const DEFAULT_THEME_ID: ThemeId = "brewhouse";

export const THEMES: ThemeDefinition[] = [
  {
    id: "brewhouse",
    name: "Brewhouse Classic",
    category: "Default",
    colors: {
      primary: "#C9783A",
      sidebar: "#866443",
      background: "#F4F0EA",
      surface: "#F8F4EE",
      border: "#D8CCBF",
      success: "#789658",
      warning: "#D6A144",
      danger: "#D95C4D",
      textPrimary: "#2C2118",
      textSecondary: "#735F4F",
      textMuted: "#9A8B7D",
      sidebarActiveBg: "#FAF6F0",
      sidebarActiveText: "#2D2218",
      sidebarActiveIcon: "#CB7A39",
      input: "#FFFFFF",
    },
  },
  {
    id: "royal_navy",
    name: "Royal Navy",
    category: "Premium",
    colors: {
      primary: "#1E3A8A",
      sidebar: "#0F172A",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      border: "#CBD5E1",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      sidebarActiveBg: "#E2E8F0",
      sidebarActiveText: "#0F172A",
      sidebarActiveIcon: "#1E3A8A",
      input: "#FFFFFF",
    },
  },
  {
    id: "emerald_luxury",
    name: "Emerald Luxury",
    category: "Royal",
    colors: {
      primary: "#0F766E",
      sidebar: "#064E3B",
      background: "#F0FDF4",
      surface: "#FFFFFF",
      border: "#BBF7D0",
      success: "#15803D",
      warning: "#CA8A04",
      danger: "#DC2626",
      textPrimary: "#052E16",
      textSecondary: "#166534",
      textMuted: "#4ADE80",
      sidebarActiveBg: "#DCFCE7",
      sidebarActiveText: "#052E16",
      sidebarActiveIcon: "#0F766E",
      input: "#FFFFFF",
    },
  },
  {
    id: "black_gold",
    name: "Black Gold",
    category: "Luxury",
    colors: {
      primary: "#D4AF37",
      sidebar: "#0A0A0A",
      background: "#121212",
      surface: "#1E1E1E",
      border: "#2A2A2A",
      success: "#22C55E",
      warning: "#D4AF37",
      danger: "#EF4444",
      textPrimary: "#F8F8F8",
      textSecondary: "#CFCFCF",
      textMuted: "#9CA3AF",
      sidebarActiveBg: "#2A2A2A",
      sidebarActiveText: "#F8F8F8",
      sidebarActiveIcon: "#D4AF37",
      input: "#1E1E1E",
    },
  },
  {
    id: "midnight_purple",
    name: "Midnight Purple",
    category: "Trending",
    colors: {
      primary: "#7C3AED",
      sidebar: "#2E1065",
      background: "#FAF5FF",
      surface: "#FFFFFF",
      border: "#DDD6FE",
      success: "#22C55E",
      warning: "#F59E0B",
      danger: "#EF4444",
      textPrimary: "#2E1065",
      textSecondary: "#6D28D9",
      textMuted: "#A78BFA",
      sidebarActiveBg: "#EDE9FE",
      sidebarActiveText: "#2E1065",
      sidebarActiveIcon: "#7C3AED",
      input: "#FFFFFF",
    },
  },
  {
    id: "rose_platinum",
    name: "Rose Platinum",
    category: "Premium",
    colors: {
      primary: "#E11D48",
      sidebar: "#881337",
      background: "#FFF1F2",
      surface: "#FFFFFF",
      border: "#FECDD3",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      textPrimary: "#4C0519",
      textSecondary: "#9F1239",
      textMuted: "#FDA4AF",
      sidebarActiveBg: "#FFE4E6",
      sidebarActiveText: "#4C0519",
      sidebarActiveIcon: "#E11D48",
      input: "#FFFFFF",
    },
  },
];

export function isValidThemeId(id: string): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}

export function getThemeById(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function themeToCssVars(theme: ThemeDefinition): Record<string, string> {
  const { colors } = theme;
  return {
    "--background": colors.background,
    "--foreground": colors.textPrimary,
    "--primary": colors.primary,
    "--sidebar": colors.sidebar,
    "--surface": colors.surface,
    "--card": colors.surface,
    "--border-color": colors.border,
    "--success": colors.success,
    "--gold": colors.warning,
    "--warning": colors.warning,
    "--danger": colors.danger,
    "--text-heading": colors.textPrimary,
    "--text-body": colors.textSecondary,
    "--text-muted": colors.textMuted,
    "--sidebar-active-bg": colors.sidebarActiveBg,
    "--sidebar-active-text": colors.sidebarActiveText,
    "--sidebar-active-icon": colors.sidebarActiveIcon,
    "--input": colors.input,
  };
}

export function applyThemeToDocument(themeId: ThemeId): void {
  if (typeof document === "undefined") return;
  const theme = getThemeById(themeId);
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);
  const vars = themeToCssVars(theme);
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}
