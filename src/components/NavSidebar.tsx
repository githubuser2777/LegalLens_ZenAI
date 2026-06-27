import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SquaresFour,
  FileText,
  MagnifyingGlass,
  ChatCircleText,
  Gear,
  Scales,
  CaretRight,
  CaretUp,
  SignOut,
  User,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type View = "dashboard" | "upload" | "search" | "chat";

interface NavSidebarProps {
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

export function NavSidebar({ activeView, onViewChange, onSettingsOpen, collapsed, userEmail }: NavSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex flex-col h-full shrink-0 transition-all duration-300 border-r border-border bg-background"
        style={{
          width: collapsed ? 64 : 240,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 shrink-0 border-b border-border bg-background" style={{ height: 56 }}>
          <div className="flex items-center justify-center w-8 h-8 bg-foreground text-background shrink-0">
            <Scales size={18} weight="bold" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-bold tracking-tight text-foreground uppercase">
                LegalLens
              </span>
              <span className="text-[10px] block text-muted-foreground uppercase tracking-widest font-bold" style={{ marginTop: -2 }}>
                ZenAI
              </span>
            </motion.div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            const button = (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-3 w-full transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                style={{
                  padding: collapsed ? "12px 0" : "12px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  className="shrink-0"
                />
                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive && (
                  <CaretRight size={14} weight="bold" className="ml-auto opacity-50" />
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="text-[10px] uppercase tracking-widest font-bold rounded-none border border-border">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return button;
          })}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col border-t border-border shrink-0 bg-background">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSettingsOpen}
                  className="flex items-center justify-center w-full py-4 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Gear size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[10px] uppercase tracking-widest font-bold rounded-none border border-border">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onSettingsOpen}
              className="flex items-center gap-3 w-full px-5 py-4 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer border-b border-border"
            >
              <Gear size={18} className="shrink-0" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          )}

          {/* User chip */}
          {!collapsed && (
            <div className="relative flex items-center justify-between px-5 py-4 bg-muted/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 border border-border bg-background text-foreground text-xs font-bold shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {userEmail?.split('@')[0] || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold truncate">
                    Operator
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setUserMenuOpen(v => !v)}
                className={`p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${userMenuOpen ? "bg-muted/50 text-foreground" : ""}`}
                title="Account Menu"
              >
                <CaretUp size={16} weight="bold" className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-4 right-4 mb-2 bg-background border border-border shadow-2xl z-50 flex flex-col"
                  >
                    <button className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-b border-border text-left">
                      <User size={16} weight="bold" />
                      Profile Settings
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-b border-border text-left">
                      <Gear size={16} weight="bold" />
                      Preferences
                    </button>
                    <button 
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <SignOut size={16} weight="bold" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
