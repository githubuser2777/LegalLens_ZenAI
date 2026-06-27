import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BentoSidebar } from "./BentoSidebar";
import { BentoDashboard } from "./BentoDashboard";
import { BentoDocumentUpload } from "./BentoDocumentUpload";
import { BentoSearchSidebar } from "./BentoSearchSidebar";
import { BentoAIChat } from "./BentoAIChat";
import { BentoContractViewer } from "./BentoContractViewer";
import { Bell, List } from "@phosphor-icons/react";
import { BentoSettingsModal } from "./BentoSettingsModal";

type View = "dashboard" | "upload" | "search" | "chat" | "viewer";

const VIEW_LABELS: Record<View, string> = {
  dashboard: "Overview",
  upload: "Documents",
  search: "Search",
  chat: "AI Assistant",
  viewer: "Document Viewer",
};

export function BentoApp({ session, loading }: { session: any; loading: boolean }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setSidebarCollapsed(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (loading || !session) return null;

  return (
    <div className="size-full flex overflow-hidden bg-[#f1f5f9] text-[#0f172a] font-sans">
      {/* Sidebar */}
      <BentoSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSettingsOpen={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        userEmail={session?.user?.email}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 p-4">
        {/* Top Header */}
        <header className="flex items-center justify-between shrink-0 mb-4 bg-white rounded-3xl px-6 py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-slate-200/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <List size={20} weight="bold" />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <h2 className="text-sm font-semibold text-slate-700">
              {VIEW_LABELS[activeView]}
            </h2>
            {activeView === 'viewer' && selectedContractId && (
              <>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-sm text-slate-400 font-mono">
                  ID: {selectedContractId.slice(0, 8)}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Bell size={20} weight="duotone" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200/50 flex flex-col overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-50">
                      <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="p-8 text-center text-slate-400 text-sm">
                      No new notifications
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 min-h-0 relative bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-slate-200/50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {activeView === "dashboard" && (
                <BentoDashboard 
                  onUploadClick={() => setActiveView("upload")} 
                  onViewDocument={(id) => {
                    setSelectedContractId(id);
                    setActiveView("viewer");
                  }}
                  userEmail={session?.user?.email}
                />
              )}
              {activeView === "upload" && (
                <BentoDocumentUpload 
                  onUploadComplete={(id) => {
                    setSelectedContractId(id);
                    setActiveView("viewer");
                  }} 
                />
              )}
              {activeView === "search" && (
                <BentoSearchSidebar 
                  onSelectDocument={(id) => {
                    setSelectedContractId(id);
                    setActiveView("viewer");
                  }}
                />
              )}
              {activeView === "chat" && <BentoAIChat />}
              {activeView === "viewer" && selectedContractId && (
                <BentoContractViewer contractId={selectedContractId} />
              )}
              {activeView === "viewer" && !selectedContractId && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>No document selected</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BentoSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
