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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setAuthError("");
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    else if (isSignUp) setAuthError("Please check your email to verify!");
  };

  if (loading) return null;

  if (!session) {
    return (
      <div className="dark size-full flex items-center justify-center" style={{ background: "#080B14", color: "#F1F5F9", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <form onSubmit={handleAuth} className="p-8 flex flex-col gap-4 rounded-xl border border-white/10 w-full max-w-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
          <h2 className="text-xl font-semibold mb-2">{isSignUp ? "Sign Up" : "Log In"} to LegalLens</h2>
          {authError && <div className="text-red-400 text-sm mb-2">{authError}</div>}
          <input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} className="p-3 text-sm rounded-lg bg-white/5 border border-white/10 outline-none focus:border-indigo-500" />
          <input type="password" placeholder="Password" required value={password} onChange={e=>setPassword(e.target.value)} className="p-3 text-sm rounded-lg bg-white/5 border border-white/10 outline-none focus:border-indigo-500" />
          <button type="submit" className="p-3 mt-2 text-sm font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors">{isSignUp ? "Sign Up" : "Log In"}</button>
          <button type="button" onClick={()=>setIsSignUp(!isSignUp)} className="text-xs text-indigo-400 mt-2 text-center">
            {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
          </button>
        </form>
      </div>
    );
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
