import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Brewhouse Admin Dashboard",
  description: "POS Admin & ERP Dashboard for Brewhouse Coffee Shop",
};

const themeInitScript = `
(function() {
  var THEMES = {
    brewhouse: { "--background":"#F4F0EA","--foreground":"#2C2118","--primary":"#C9783A","--sidebar":"#866443","--surface":"#F8F4EE","--card":"#F8F4EE","--border-color":"#D8CCBF","--success":"#789658","--gold":"#D6A144","--warning":"#D6A144","--danger":"#D95C4D","--text-heading":"#2C2118","--text-body":"#735F4F","--text-muted":"#9A8B7D","--sidebar-active-bg":"#FAF6F0","--sidebar-active-text":"#2D2218","--sidebar-active-icon":"#CB7A39","--input":"#FFFFFF" },
    royal_navy: { "--background":"#F8FAFC","--foreground":"#0F172A","--primary":"#1E3A8A","--sidebar":"#0F172A","--surface":"#FFFFFF","--card":"#FFFFFF","--border-color":"#CBD5E1","--success":"#16A34A","--gold":"#F59E0B","--warning":"#F59E0B","--danger":"#DC2626","--text-heading":"#0F172A","--text-body":"#475569","--text-muted":"#94A3B8","--sidebar-active-bg":"#E2E8F0","--sidebar-active-text":"#0F172A","--sidebar-active-icon":"#1E3A8A","--input":"#FFFFFF" },
    emerald_luxury: { "--background":"#F0FDF4","--foreground":"#052E16","--primary":"#0F766E","--sidebar":"#064E3B","--surface":"#FFFFFF","--card":"#FFFFFF","--border-color":"#BBF7D0","--success":"#15803D","--gold":"#CA8A04","--warning":"#CA8A04","--danger":"#DC2626","--text-heading":"#052E16","--text-body":"#166534","--text-muted":"#4ADE80","--sidebar-active-bg":"#DCFCE7","--sidebar-active-text":"#052E16","--sidebar-active-icon":"#0F766E","--input":"#FFFFFF" },
    black_gold: { "--background":"#121212","--foreground":"#F8F8F8","--primary":"#D4AF37","--sidebar":"#0A0A0A","--surface":"#1E1E1E","--card":"#1E1E1E","--border-color":"#2A2A2A","--success":"#22C55E","--gold":"#D4AF37","--warning":"#D4AF37","--danger":"#EF4444","--text-heading":"#F8F8F8","--text-body":"#CFCFCF","--text-muted":"#9CA3AF","--sidebar-active-bg":"#2A2A2A","--sidebar-active-text":"#F8F8F8","--sidebar-active-icon":"#D4AF37","--input":"#1E1E1E" },
    midnight_purple: { "--background":"#FAF5FF","--foreground":"#2E1065","--primary":"#7C3AED","--sidebar":"#2E1065","--surface":"#FFFFFF","--card":"#FFFFFF","--border-color":"#DDD6FE","--success":"#22C55E","--gold":"#F59E0B","--warning":"#F59E0B","--danger":"#EF4444","--text-heading":"#2E1065","--text-body":"#6D28D9","--text-muted":"#A78BFA","--sidebar-active-bg":"#EDE9FE","--sidebar-active-text":"#2E1065","--sidebar-active-icon":"#7C3AED","--input":"#FFFFFF" },
    rose_platinum: { "--background":"#FFF1F2","--foreground":"#4C0519","--primary":"#E11D48","--sidebar":"#881337","--surface":"#FFFFFF","--card":"#FFFFFF","--border-color":"#FECDD3","--success":"#16A34A","--gold":"#F59E0B","--warning":"#F59E0B","--danger":"#DC2626","--text-heading":"#4C0519","--text-body":"#9F1239","--text-muted":"#FDA4AF","--sidebar-active-bg":"#FFE4E6","--sidebar-active-text":"#4C0519","--sidebar-active-icon":"#E11D48","--input":"#FFFFFF" }
  };
  try {
    var stored = localStorage.getItem("brewhouse-theme");
    var id = stored && THEMES[stored] ? stored : "brewhouse";
    var vars = THEMES[id];
    var root = document.documentElement;
    root.setAttribute("data-theme", id);
    for (var key in vars) {
      root.style.setProperty(key, vars[key]);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-full font-sans bg-background text-text-body">
        <AppProviders>
          <DashboardLayout>{children}</DashboardLayout>
        </AppProviders>
      </body>
    </html>
  );
}
