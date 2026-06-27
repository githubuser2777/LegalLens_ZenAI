import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Key,
  Cpu,
  Shield,
  Eye,
  EyeClosed,
  CheckCircle,
  Spinner,
  WarningCircle,
  CaretRight,
  PaintBrush,
} from "@phosphor-icons/react";
import { Switch } from "./ui/switch";
import { useTheme } from "./ThemeProvider";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "appearance" | "api" | "privacy";

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number; weight?: string }> }[] = [
  { id: "appearance", label: "Appearance", icon: PaintBrush },
  { id: "api", label: "Agent Config", icon: Key },
  { id: "privacy", label: "Privacy", icon: Shield },
];



function ApiKeyRow({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");

  const test = () => {
    if (!value) return;
    setStatus("testing");
    setTimeout(() => setStatus(value.length > 8 ? "ok" : "error"), 1400);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-muted/10 border border-border focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground transition-all">
          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setStatus("idle"); }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-xs font-mono font-bold placeholder:text-muted-foreground"
          />
          <button onClick={() => setVisible(!visible)}>
            {visible ? (
              <EyeClosed size={16} weight="bold" className="text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
              <Eye size={16} weight="bold" className="text-muted-foreground hover:text-foreground transition-colors" />
            )}
          </button>
        </div>
        <button
          onClick={test}
          disabled={!value || status === "testing"}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
            !value ? "opacity-50 cursor-not-allowed bg-muted border border-border text-muted-foreground" : "bg-foreground text-background hover:bg-foreground/90 border border-foreground"
          }`}
        >
          {status === "testing" ? (
            <Spinner size={16} weight="bold" className="animate-spin" />
          ) : status === "ok" ? (
            <CheckCircle size={16} weight="bold" />
          ) : status === "error" ? (
            <WarningCircle size={16} weight="bold" />
          ) : (
            "Test"
          )}
        </button>
      </div>
      {status === "ok" && (
        <p className="text-[10px] font-mono font-bold text-emerald-500">CONNECTION VERIFIED</p>
      )}
      {status === "error" && (
        <p className="text-[10px] font-mono font-bold text-destructive">INVALID OR EXPIRED KEY</p>
      )}
    </div>
  );
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col bg-background border border-border w-full max-w-4xl max-h-[85vh] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background shrink-0">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">
              System Configuration
            </h2>
            <p className="text-xs font-mono font-bold opacity-70 mt-1 uppercase">
              Manage API keys, models, and privacy parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-transparent hover:border-background transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tab nav */}
          <nav className="flex flex-col gap-2 p-6 shrink-0 w-64 border-r border-border bg-muted/5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-left transition-colors border w-full ${
                    isActive
                      ? "bg-muted/50 text-foreground border-border"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <Icon size={16} weight="bold" />
                  {tab.label}
                  {isActive && <CaretRight size={14} weight="bold" className="ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-8 bg-background">
            {activeTab === "api" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                    Google AI Studio Config
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Provide your Gemini API key to run the agent. Models and parameters are predefined.
                  </p>
                </div>
                <ApiKeyRow label="Gemini API Key" placeholder="AIzaSy..." />
                <div className="h-px bg-border w-full" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                    Integrations
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Connect external document sources.
                  </p>
                </div>
                <ApiKeyRow label="DocuSign API Token" placeholder="eyJ…" />
                <ApiKeyRow label="Clio API Key" placeholder="cl_live_…" />
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                    Data & Privacy
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Control how your documents and usage data are handled.
                  </p>
                </div>
                <div className="flex flex-col border border-border">
                  {[
                    {
                      key: "dataRetention" as const,
                      label: "Document Retention",
                      desc: "Keep processed documents in your workspace for 90 days",
                    },
                    {
                      key: "encryptAtRest" as const,
                      label: "Encryption at Rest",
                      desc: "AES-256 encryption for all stored documents and metadata",
                    },
                    {
                      key: "auditLog" as const,
                      label: "Audit Logging",
                      desc: "Log all document access and AI queries for compliance",
                    },
                    {
                      key: "telemetry" as const,
                      label: "Usage Telemetry",
                      desc: "Share anonymous usage data to improve the product",
                    },
                    {
                      key: "shareWithProviders" as const,
                      label: "Share with AI Providers",
                      desc: "Allow AI providers to use your queries for model training",
                    },
                  ].map(({ key, label, desc }, idx, arr) => (
                    <div
                      key={key}
                      className={`flex items-start justify-between gap-6 p-5 ${
                        idx !== arr.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">
                          {label}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">
                          {desc}
                        </p>
                      </div>
                      <Switch
                        checked={privacyToggles[key]}
                        onCheckedChange={() => togglePrivacy(key)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                    UI Theme
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Choose the visual style of the application.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUiStyle("modern")}
                    className={`flex-1 flex flex-col items-center gap-3 p-6 text-center transition-all ${
                      uiStyle === "modern" 
                        ? "border-2 border-foreground bg-foreground/5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]" 
                        : "border-2 border-border hover:border-foreground opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-16 h-12 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center">
                      <div className="w-8 h-2 bg-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest">Modern</h4>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">Brutalist</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUiStyle("classic")}
                    className={`flex-1 flex flex-col items-center gap-3 p-6 text-center transition-all ${
                      uiStyle === "classic" 
                        ? "border-2 border-foreground bg-foreground/5 rounded-xl" 
                        : "border-2 border-border hover:border-foreground rounded-xl opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-16 h-12 border border-border bg-background rounded-lg shadow-sm flex items-center justify-center">
                      <div className="w-8 h-2 bg-foreground rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">Classic</h4>
                      <p className="text-xs text-muted-foreground mt-1">Web 2.0</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-muted/5 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest border border-border text-foreground hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-foreground text-background border border-foreground hover:bg-foreground/90 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </motion.div>
    </div>
  );
}
