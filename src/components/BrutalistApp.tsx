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
import { Bell, List } from "@phosphor-icons/react";
import { useTheme } from "./ThemeProvider";

type View = "dashboard" | "upload" | "search" | "chat" | "viewer";

const VIEW_LABELS: Record<View, string> = {
  dashboard: "Dashboard",
  upload: "Documents",
  search: "Search",
  chat: "AI Chat",
  viewer: "Document Viewer",
};

export function BrutalistApp({ session, loading }: { session: any; loading: boolean }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { uiStyle } = useTheme();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setSidebarCollapsed(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (loading || !session) return null;

  return (
    <div className={`${uiStyle === 'modern' ? 'dark' : ''} size-full flex overflow-hidden bg-background text-foreground`}>
      {/* Sidebar */}
      <NavSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSettingsOpen={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        userEmail={session?.user?.email}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 border-l border-border">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 shrink-0 bg-background border-b border-border"
          style={{ height: 56 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              LegalLens
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-foreground">
              {VIEW_LABELS[activeView]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification dot */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(v => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-none border border-border text-muted-foreground hover:bg-muted transition-colors active:scale-95"
              >
                <Bell size={16} weight="bold" />
              </button>
              <div
                className="absolute w-2 h-2 bg-foreground border border-background rounded-none pointer-events-none"
                style={{ top: -2, right: -2 }}
              />
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-10 right-0 w-64 bg-background border border-border shadow-2xl z-50 flex flex-col"
                  >
                    <div className="p-3 border-b border-border">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Notifications</span>
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No new notifications</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="flex items-center justify-center w-8 h-8 rounded-none border border-border text-muted-foreground hover:bg-muted transition-colors active:scale-95"
            >
              <List size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* View content with animated transitions */}
        <div className="flex-1 overflow-hidden relative bg-background">
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
