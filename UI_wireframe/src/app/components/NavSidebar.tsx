import { motion } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  Search,
  MessageSquare,
  Settings,
  Scale,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type View = "dashboard" | "upload" | "search" | "chat";

interface NavSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onSettingsOpen: () => void;
  collapsed: boolean;
}

const navItems: { id: View; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Documents", icon: FileText },
  { id: "search", label: "Search", icon: Search },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
];

export function NavSidebar({ activeView, onViewChange, onSettingsOpen, collapsed }: NavSidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex flex-col h-full shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: "rgba(12, 15, 30, 0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 shrink-0" style={{ height: 64 }}>
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.4)",
            }}
          >
            <Scale size={16} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-sm font-semibold tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #A78BFA, #67E8F9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LegalLens
              </span>
              <span className="text-xs block" style={{ color: "#94A3B8", marginTop: -2 }}>
                ZenAI
              </span>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            const button = (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileHover={{ x: collapsed ? 0 : 2 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 w-full rounded-lg transition-colors duration-150 cursor-pointer"
                style={{
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))"
                    : "transparent",
                  border: isActive ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  color: isActive ? "#A78BFA" : "#94A3B8",
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? "#A78BFA" : "#64748B", flexShrink: 0 }}
                />
                {!collapsed && (
                  <span className="text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive && (
                  <ChevronRight size={14} className="ml-auto" style={{ color: "#A78BFA" }} />
                )}
              </motion.button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return button;
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-4 shrink-0">
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 8px 12px" }} />
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSettingsOpen}
                  className="flex items-center justify-center w-full rounded-lg transition-colors duration-150 cursor-pointer"
                  style={{
                    padding: "10px 0",
                    color: "#64748B",
                    border: "1px solid transparent",
                  }}
                >
                  <Settings size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onSettingsOpen}
              className="flex items-center gap-3 w-full rounded-lg transition-colors duration-150 cursor-pointer"
              style={{
                padding: "10px 12px",
                color: "#64748B",
                border: "1px solid transparent",
              }}
            >
              <Settings size={18} style={{ flexShrink: 0 }} />
              <span className="text-sm">Settings</span>
            </button>
          )}

          {/* User chip */}
          {!collapsed && (
            <div
              className="flex items-center gap-2 mt-2 rounded-lg px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                }}
              >
                JD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "#F1F5F9" }}>
                  Jane Doe
                </p>
                <p className="text-xs truncate" style={{ color: "#94A3B8" }}>
                  Senior Counsel
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
