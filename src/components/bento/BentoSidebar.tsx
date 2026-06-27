import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SquaresFour,
  FileText,
  MagnifyingGlass,
  ChatCircleText,
  Gear,
  Scales,
  SignOut,
  User,
  CaretUp,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

type View = "dashboard" | "upload" | "search" | "chat";

interface BentoSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onSettingsOpen: () => void;
  collapsed: boolean;
  userEmail?: string;
}

const navItems: { id: View; label: string; icon: React.ComponentType<{ size?: number; weight?: string; className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: SquaresFour },
  { id: "upload", label: "Documents", icon: FileText },
  { id: "search", label: "Search", icon: MagnifyingGlass },
  { id: "chat", label: "AI Chat", icon: ChatCircleText },
];

export function BentoSidebar({ activeView, onViewChange, onSettingsOpen, collapsed, userEmail }: BentoSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <aside
      className="flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 shrink-0 transition-all duration-500 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 overflow-hidden"
      style={{
        width: collapsed ? 80 : 260,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8 shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-blue-600 text-white shrink-0 shadow-lg shadow-blue-600/20">
          <Scales size={20} weight="fill" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              LegalLens
            </span>
          </motion.div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col flex-1 px-4 py-4 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative flex items-center gap-4 w-full transition-colors duration-300 cursor-pointer p-3 rounded-2xl group overflow-hidden"
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-blue-50 rounded-2xl"
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              )}
              
              <div className="relative z-10">
                <Icon
                  size={22}
                  weight={isActive ? "fill" : "duotone"}
                  className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"}
                />
              </div>
              
              {!collapsed && (
                <span className={`relative z-10 text-sm font-medium ${isActive ? "text-blue-700" : "text-slate-500 group-hover:text-slate-700"} transition-colors`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col p-4 shrink-0 gap-2">
        <button
          onClick={onSettingsOpen}
          className="flex items-center gap-4 w-full p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer rounded-2xl group"
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <Gear size={22} weight="duotone" className="group-hover:rotate-45 transition-transform duration-500" />
          {!collapsed && <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Settings</span>}
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-4 w-full p-3 mt-2 text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl"
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User size={16} weight="fill" className="text-slate-500" />
            </div>
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="text-sm font-medium text-slate-700 truncate">
                  {userEmail?.split("@")[0] || "Account"}
                </span>
                <CaretUp size={14} className={`transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
              </div>
            )}
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col p-2 z-50 overflow-hidden"
              >
                {!collapsed && (
                  <div className="px-3 py-2 border-b border-slate-50 mb-2">
                    <p className="text-xs font-medium text-slate-400 truncate">{userEmail}</p>
                  </div>
                )}
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                >
                  <SignOut size={16} weight="bold" />
                  {!collapsed && "Sign Out"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
