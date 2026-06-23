import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Key,
  Cpu,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Switch } from "./ui/switch";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "api" | "model" | "privacy";

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "api", label: "API Keys", icon: Key },
  { id: "model", label: "Model Selection", icon: Cpu },
  { id: "privacy", label: "Privacy", icon: Shield },
];

const MODELS = [
  {
    id: "claude-opus",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    description: "Most capable model for complex legal reasoning and nuanced analysis",
    badge: "Recommended",
    badgeColor: "#10B981",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    description: "Balanced performance for routine document processing",
    badge: "Fast",
    badgeColor: "#06B6D4",
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Strong general-purpose model with broad knowledge",
    badge: null,
    badgeColor: null,
  },
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
        {label}
      </label>
      <div className="flex gap-2">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setStatus("idle"); }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#F1F5F9" }}
          />
          <button onClick={() => setVisible(!visible)}>
            {visible ? (
              <EyeOff size={13} style={{ color: "#64748B" }} />
            ) : (
              <Eye size={13} style={{ color: "#64748B" }} />
            )}
          </button>
        </div>
        <button
          onClick={test}
          disabled={!value || status === "testing"}
          className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94A3B8",
            opacity: !value ? 0.5 : 1,
          }}
        >
          {status === "testing" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : status === "ok" ? (
            <CheckCircle size={12} style={{ color: "#10B981" }} />
          ) : status === "error" ? (
            <AlertCircle size={12} style={{ color: "#EF4444" }} />
          ) : (
            "Test"
          )}
        </button>
      </div>
      {status === "ok" && (
        <p className="text-xs" style={{ color: "#34D399" }}>Connection verified</p>
      )}
      {status === "error" && (
        <p className="text-xs" style={{ color: "#F87171" }}>Invalid or expired key</p>
      )}
    </div>
  );
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("api");
  const [selectedModel, setSelectedModel] = useState("claude-opus");
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col overflow-hidden"
        style={{
          width: "min(680px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 80px)",
          background: "#0C0F1E",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "#F1F5F9", letterSpacing: "-0.01em" }}>
              Settings
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              Manage API keys, models, and privacy preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors duration-150"
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <X size={14} style={{ color: "#94A3B8" }} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tab nav */}
          <nav
            className="flex flex-col gap-1 p-3 shrink-0"
            style={{
              width: 180,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 w-full"
                  style={{
                    background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
                    border: isActive ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                    color: isActive ? "#A78BFA" : "#64748B",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                  {isActive && <ChevronRight size={12} className="ml-auto" style={{ color: "#A78BFA" }} />}
                </button>
              );
            })}
          </nav>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "api" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                    AI Provider Keys
                  </h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    Keys are stored encrypted and never transmitted in plaintext.
                  </p>
                </div>
                <ApiKeyRow label="Anthropic API Key" placeholder="sk-ant-…" />
                <ApiKeyRow label="OpenAI API Key" placeholder="sk-…" />
                <div
                  style={{ height: 1, background: "rgba(255,255,255,0.06)" }}
                />
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                    Integrations
                  </h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    Connect external document sources.
                  </p>
                </div>
                <ApiKeyRow label="DocuSign API Token" placeholder="eyJ…" />
                <ApiKeyRow label="Clio API Key" placeholder="cl_live_…" />
              </motion.div>
            )}

            {activeTab === "model" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                    Default AI Model
                  </h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    Choose the model used for document analysis and chat.
                  </p>
                </div>
                {MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className="flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-150 w-full"
                      style={{
                        background: isSelected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                        border: isSelected
                          ? "1px solid rgba(124,58,237,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="rounded-full mt-0.5 shrink-0 flex items-center justify-center"
                        style={{
                          width: 16,
                          height: 16,
                          border: isSelected ? "2px solid #7C3AED" : "2px solid rgba(255,255,255,0.2)",
                          background: isSelected ? "#7C3AED" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <div className="rounded-full" style={{ width: 6, height: 6, background: "white" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                            {model.name}
                          </span>
                          <span className="text-xs" style={{ color: "#64748B" }}>
                            {model.provider}
                          </span>
                          {model.badge && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{
                                background: `${model.badgeColor}22`,
                                color: model.badgeColor!,
                                border: `1px solid ${model.badgeColor}44`,
                              }}
                            >
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                          {model.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                    Data & Privacy
                  </h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    Control how your documents and usage data are handled.
                  </p>
                </div>
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
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 py-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                        {label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                        {desc}
                      </p>
                    </div>
                    <Switch
                      checked={privacyToggles[key]}
                      onCheckedChange={() => togglePrivacy(key)}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-150"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94A3B8",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.3)",
            }}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
