import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  PaintBrush,
  Shield,
  Key,
  CaretRight,
  Monitor,
  Moon,
  Sun,
  CheckCircle,
} from "@phosphor-icons/react";
import { useTheme } from "../ThemeProvider";
import * as Switch from "@radix-ui/react-switch";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "appearance" | "api" | "privacy";

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number; weight?: string }> }[] = [
  { id: "appearance", label: "Appearance", icon: PaintBrush },
  { id: "api", label: "API Configuration", icon: Key },
  { id: "privacy", label: "Privacy", icon: Shield },
];

function ApiKeyRow({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="password"
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    </div>
  );
}

export function BentoSettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const { uiStyle, setUiStyle } = useTheme();
  const [privacyToggles, setPrivacyToggles] = useState({
    dataRetention: true,
    telemetry: false,
    auditLog: true,
    encryptAtRest: true,
    shareWithProviders: false,
  });

  if (!open) return null;

  const togglePrivacy = (key: keyof typeof privacyToggles) =>
    setPrivacyToggles((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-col bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white shrink-0 relative z-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Settings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage your preferences and configurations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tab nav */}
          <nav className="flex flex-col gap-2 p-6 shrink-0 w-64 border-r border-slate-100 bg-slate-50/50">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors rounded-2xl group overflow-hidden"
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-tab-active"
                      className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-200/50"
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  )}
                  <Icon 
                    size={20} 
                    weight={isActive ? "fill" : "duotone"} 
                    className={`relative z-10 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"}`} 
                  />
                  <span className={`relative z-10 ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700 transition-colors"}`}>
                    {tab.label}
                  </span>
                  {isActive && <CaretRight size={16} className="ml-auto text-slate-400 relative z-10" />}
                </button>
              );
            })}
          </nav>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white relative">
            <AnimatePresence mode="wait">
              {activeTab === "api" && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-8 max-w-2xl"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      Google AI Studio Config
                    </h3>
                    <p className="text-sm text-slate-500">
                      Provide your Gemini API key to run the agent. Models and parameters are predefined.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-6">
                    <ApiKeyRow label="Gemini API Key" placeholder="AIzaSy..." />
                  </div>

                  <div className="h-px bg-slate-100 w-full" />
                  
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      Supabase Vector DB
                    </h3>
                    <p className="text-sm text-slate-500">
                      Required for document embeddings and semantic search.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-6">
                    <ApiKeyRow label="Supabase URL" placeholder="https://xyz.supabase.co" />
                    <ApiKeyRow label="Supabase Service Role Key" placeholder="eyJhbG..." />
                  </div>
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-8 max-w-2xl"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      Privacy & Security
                    </h3>
                    <p className="text-sm text-slate-500">
                      Configure how your sensitive legal data is handled and retained.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {[
                      { id: "dataRetention", label: "Local Data Retention", desc: "Keep parsed documents stored locally in browser storage" },
                      { id: "telemetry", label: "App Telemetry", desc: "Send anonymous usage data to help improve LegalLens" },
                      { id: "auditLog", label: "Strict Audit Logging", desc: "Record every document access and query in secure logs" },
                      { id: "encryptAtRest", label: "Encrypt DB at Rest", desc: "Ensure Supabase instance forces column-level encryption" },
                      { id: "shareWithProviders", label: "Allow Model Training", desc: "Permit AI providers (Google) to use queries for model improvements" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <Switch.Root
                          checked={privacyToggles[item.id as keyof typeof privacyToggles]}
                          onCheckedChange={() => togglePrivacy(item.id as keyof typeof privacyToggles)}
                          className="w-11 h-6 bg-slate-200 rounded-full data-[state=checked]:bg-blue-600 transition-colors shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                        >
                          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-sm" />
                        </Switch.Root>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-8 max-w-2xl"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      User Interface Style
                    </h3>
                    <p className="text-sm text-slate-500">
                      Choose your preferred aesthetic for the application.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Modern Brutalist Button */}
                    <button
                      onClick={() => setUiStyle("modern")}
                      className={`relative flex flex-col p-6 rounded-3xl border-2 text-left transition-all ${
                        uiStyle === "modern"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {uiStyle === "modern" && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <CheckCircle size={24} weight="fill" />
                        </div>
                      )}
                      <div className="w-12 h-12 mb-4 bg-slate-900 flex items-center justify-center shadow-[4px_4px_0_0_rgba(15,23,42,1)] rounded-none">
                        <Monitor size={24} className="text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">Modern</h4>
                      <p className="text-sm text-slate-500 mt-1">High contrast brutalist design with sharp edges.</p>
                    </button>

                    {/* Classic Bento Button */}
                    <button
                      onClick={() => setUiStyle("classic")}
                      className={`relative flex flex-col p-6 rounded-3xl border-2 text-left transition-all ${
                        uiStyle === "classic"
                          ? "border-blue-600 bg-blue-50/50 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.2)]"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {uiStyle === "classic" && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <CheckCircle size={24} weight="fill" />
                        </div>
                      )}
                      <div className="w-12 h-12 mb-4 bg-white border border-slate-200 flex items-center justify-center shadow-sm rounded-2xl">
                        <Sun size={24} className="text-slate-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">Classic (Bento)</h4>
                      <p className="text-sm text-slate-500 mt-1">Soft, rounded glassmorphism with diffusion shadows.</p>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
