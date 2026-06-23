import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  FileText,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Paperclip,
  X,
} from "lucide-react";

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  loading?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello, Jane. I've analysed 3 documents in your current session. I can help you identify key clauses, compare contract terms, flag potential risks, or summarise legal obligations. What would you like to explore?",
    timestamp: "09:14",
  },
  {
    id: "2",
    role: "user",
    content:
      "Can you identify the indemnification clauses in the Merriweather NDA and flag anything unusual?",
    timestamp: "09:15",
  },
  {
    id: "3",
    role: "assistant",
    content: `I found **2 indemnification clauses** in the Merriweather NDA (Sections 8.2 and 11.4).\n\n**Section 8.2** — Standard mutual indemnification for breach of confidentiality. No concerns here; the language is consistent with market standard for bilateral NDAs.\n\n**Section 11.4** ⚠️ — This clause extends indemnification to *consequential and indirect damages*, which is atypical. Most NDAs cap or exclude consequential damages entirely. I'd recommend negotiating this back to direct damages only, or capping liability at a fixed sum.\n\nWould you like me to suggest revised language for Section 11.4?`,
    timestamp: "09:15",
  },
];

const SUGGESTED_PROMPTS = [
  "Summarise all force majeure clauses",
  "Compare non-compete terms across documents",
  "Flag clauses with high liability exposure",
  "Extract all governing law provisions",
];

const ATTACHED_DOCS = [
  { id: "a", name: "NDA_Merriweather.pdf" },
  { id: "b", name: "ServiceAgreement_TechV.pdf" },
];

const MODELS = ["Claude Opus 4.8", "Claude Sonnet 4.6", "GPT-4o"];

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
          className="rounded-full"
          style={{ width: 6, height: 6, background: "#A78BFA" }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const lines = message.content.split("\n");

  const renderLine = (line: string, i: number) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const withWarning = bold.replace("⚠️", '<span style="color:#FCD34D">⚠️</span>');
    return (
      <p
        key={i}
        className="text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: withWarning }}
        style={{ color: isUser ? "#F1F5F9" : "#CBD5E1", marginBottom: i < lines.length - 1 ? 8 : 0 }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0 text-xs font-semibold"
        style={{
          width: 32,
          height: 32,
          background: isUser
            ? "linear-gradient(135deg, #7C3AED, #4F46E5)"
            : "linear-gradient(135deg, #06B6D4, #3B82F6)",
          boxShadow: isUser
            ? "0 0 12px rgba(124,58,237,0.3)"
            : "0 0 12px rgba(6,182,212,0.3)",
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        {isUser ? "JD" : <Sparkles size={14} className="text-white" />}
      </div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="px-4 py-3 rounded-2xl"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "16px 16px 4px 16px",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px 16px 16px 4px",
                }
          }
        >
          {message.loading ? <LoadingDots /> : lines.map((line, i) => renderLine(line, i))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "#475569" }}>
            {message.timestamp}
          </span>
          {!isUser && !message.loading && (
            <>
              <button className="rounded p-0.5 transition-colors hover:bg-white/10">
                <Copy size={11} style={{ color: "#475569" }} />
              </button>
              <button className="rounded p-0.5 transition-colors hover:bg-white/10">
                <ThumbsUp size={11} style={{ color: "#475569" }} />
              </button>
              <button className="rounded p-0.5 transition-colors hover:bg-white/10">
                <ThumbsDown size={11} style={{ color: "#475569" }} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [attachedDocs, setAttachedDocs] = useState(ATTACHED_DOCS);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    const loadingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      loading: true,
    };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? {
                ...m,
                loading: false,
                content:
                  "I'm analysing your query against the attached documents. Based on my review, I've identified several relevant clauses that match your request. Would you like a detailed breakdown or a high-level summary?",
              }
            : m
        )
      );
      setIsLoading(false);
    }, 2200);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main chat column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                boxShadow: "0 0 14px rgba(6,182,212,0.3)",
              }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                ZenAI Legal Assistant
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="rounded-full" style={{ width: 6, height: 6, background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>Active · Analysing 2 documents</span>
              </div>
            </div>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors duration-150"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8",
              }}
            >
              <span style={{ color: "#A78BFA" }}>{selectedModel}</span>
              <ChevronDown size={11} />
            </button>
            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "#0F1629",
                    border: "1px solid rgba(255,255,255,0.1)",
                    minWidth: 160,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs transition-colors duration-100"
                      style={{
                        color: model === selectedModel ? "#A78BFA" : "#94A3B8",
                        background: model === selectedModel ? "rgba(124,58,237,0.1)" : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          model === selectedModel ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          model === selectedModel ? "rgba(124,58,237,0.1)" : "transparent")
                      }
                    >
                      {model}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div
          className="px-5 py-2 flex gap-2 overflow-x-auto shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 shrink-0"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94A3B8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                e.currentTarget.style.color = "#A78BFA";
                e.currentTarget.style.border = "1px solid rgba(124,58,237,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="px-5 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Attached docs */}
          {attachedDocs.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {attachedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    color: "#A78BFA",
                  }}
                >
                  <FileText size={10} />
                  {doc.name}
                  <button onClick={() => setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))}>
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className="flex items-end gap-3 rounded-xl px-4 py-3 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button className="shrink-0 mb-0.5">
              <Paperclip size={15} style={{ color: "#64748B" }} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about clauses, risks, obligations… (Enter to send)"
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed"
              style={{ color: "#F1F5F9", minHeight: 24, maxHeight: 120 }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "24px";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <motion.button
              onClick={sendMessage}
              whileTap={{ scale: 0.9 }}
              disabled={!input.trim() || isLoading}
              className="shrink-0 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{
                width: 32,
                height: 32,
                background:
                  input.trim() && !isLoading
                    ? "linear-gradient(135deg, #7C3AED, #4F46E5)"
                    : "rgba(255,255,255,0.08)",
                boxShadow: input.trim() && !isLoading ? "0 0 12px rgba(124,58,237,0.4)" : "none",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
              }}
            >
              <Send size={13} style={{ color: input.trim() && !isLoading ? "white" : "#475569" }} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Context panel */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="flex flex-col gap-4 p-4 shrink-0 overflow-y-auto"
        style={{
          width: 240,
          background: "rgba(12,15,30,0.6)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h3 className="text-xs uppercase tracking-wider pt-1" style={{ color: "#64748B" }}>
          Context Documents
        </h3>
        {attachedDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 p-2.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <FileText size={13} style={{ color: "#7C3AED", flexShrink: 0 }} />
            <span className="text-xs truncate" style={{ color: "#CBD5E1" }}>
              {doc.name}
            </span>
          </div>
        ))}

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        <h3 className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
          Session Stats
        </h3>
        {[
          { label: "Tokens used", value: "14,280" },
          { label: "Clauses found", value: "38" },
          { label: "Risk flags", value: "3" },
          { label: "Summaries", value: "5" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#64748B" }}>
              {label}
            </span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: "#F1F5F9" }}>
              {value}
            </span>
          </div>
        ))}
      </motion.aside>
    </div>
  );
}
