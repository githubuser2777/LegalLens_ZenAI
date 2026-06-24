import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { NavSidebar } from "./NavSidebar";
import { Dashboard } from "./Dashboard";
import { DocumentUpload } from "./DocumentUpload";
import { SearchSidebar } from "./SearchSidebar";
import { AIChatInterface } from "./AIChatInterface";
import { SettingsModal } from "./SettingsModal";
import { ContractViewer } from "./ContractViewer";

type View = "dashboard" | "upload" | "search" | "chat" | "viewer";

const VIEW_LABELS: Record<View, string> = {
  dashboard: "Dashboard",
  upload: "Documents",
  search: "Search",
  chat: "AI Chat",
  viewer: "Document Viewer",
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState<View>("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setSidebarCollapsed(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (loading) return null;

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    // Force dark mode at the root
    <div
      className="dark size-full flex overflow-hidden"
      style={{ background: "#080B14", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(124,58,237,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(6,182,212,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Sidebar */}
      <NavSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSettingsOpen={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        userEmail={session?.user?.email}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{
            height: 56,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(8,11,20,0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: "#475569" }}>
              LegalLens
            </span>
            <span style={{ color: "#475569" }}>/</span>
            <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
              {VIEW_LABELS[activeView]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification dot */}
            <div className="relative">
              <button
                className="flex items-center justify-center rounded-lg transition-colors duration-150"
                style={{
                  width: 32,
                  height: 32,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748B",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <div
                className="absolute rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  background: "#7C3AED",
                  border: "2px solid #080B14",
                  top: -1,
                  right: -1,
                }}
              />
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="flex items-center justify-center rounded-lg transition-colors duration-150"
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#64748B",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* View content with animated transitions */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                <Dashboard 
                  userEmail={session?.user?.email}
                  onUploadClick={() => setActiveView("upload")}
                  onViewDocument={(id: string) => {
                     setSelectedContractId(id);
                     setActiveView("viewer");
                  }}
                />
              </motion.div>
            )}
            {activeView === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="absolute inset-0 overflow-hidden">
                <DocumentUpload />
              </motion.div>
            )}
            {activeView === "search" && (
              <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="absolute inset-0 overflow-hidden">
                <SearchSidebar />
              </motion.div>
            )}
            {activeView === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="absolute inset-0 overflow-hidden">
                <AIChatInterface />
              </motion.div>
            )}
            {activeView === "viewer" && selectedContractId && (
              <motion.div key="viewer" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} className="absolute inset-0 overflow-hidden z-20">
                <ContractViewer 
                  contractId={selectedContractId} 
                  onClose={() => {
                    setSelectedContractId(null);
                    setActiveView("dashboard");
                  }} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Settings modal */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
