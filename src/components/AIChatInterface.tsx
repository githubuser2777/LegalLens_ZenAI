import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PaperPlaneRight,
  FileText,
  Sparkle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  CaretDown,
  Paperclip,
  X,
  Trash,
} from "@phosphor-icons/react";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  loading?: boolean;
  thoughtProcess?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I am ZenAI Operator. How can I assist you with your legal documents today?",
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  }
];

const SUGGESTED_PROMPTS = [
  "Summarise all force majeure clauses",
  "Compare non-compete terms across documents",
  "Flag clauses with high liability exposure",
  "Extract all governing law provisions",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ATTACHED_DOCS: any[] = [];

const MODELS = ["Claude Opus 4.8", "Claude Sonnet 4.6", "GPT-4o"];

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 h-6">
      <span className="w-2 h-2 bg-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const lines = message.content.split("\n");

  const renderLine = (line: string, i: number) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const withWarning = bold.replace("⚠️", '<span class="text-amber-500 font-bold">⚠️</span>');
    return (
      <p
        key={i}
        className="text-xs font-mono leading-relaxed"
        dangerouslySetInnerHTML={{ __html: withWarning }}
        style={{ marginBottom: i < lines.length - 1 ? 8 : 0 }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex items-center justify-center border-2 border-foreground shrink-0 text-xs font-bold uppercase tracking-widest mt-1 ${
          isUser ? "bg-foreground text-background" : "bg-background text-foreground"
        }`}
        style={{ width: 40, height: 40 }}
      >
        {isUser ? "JD" : <Sparkle size={20} weight="bold" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Render Thought Process */}
        {!isUser && message.thoughtProcess && message.thoughtProcess.length > 0 && (
          <div className="flex flex-col gap-1 mb-1">
            {message.thoughtProcess.map((thought, idx) => (
              <div key={idx} className="text-[10px] font-mono text-muted-foreground bg-muted/20 px-2 py-1 border-l-2 border-primary/50">
                &gt; {thought}
              </div>
            ))}
          </div>
        )}

        <div
          className={`p-4 border-2 border-foreground ${
            isUser ? "bg-foreground/5" : "bg-muted/10"
          }`}
        >
          {message.loading ? <LoadingDots /> : lines.map((line, i) => renderLine(line, i))}
        </div>

        <div className={`flex items-center gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] font-mono font-bold text-muted-foreground border border-border px-1.5 py-0.5">
            {message.timestamp}
          </span>
          {!isUser && !message.loading && (
            <div className="flex gap-2">
              <button className="p-1 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors">
                <Copy size={14} weight="bold" />
              </button>
              <button className="p-1 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp size={14} weight="bold" />
              </button>
              <button className="p-1 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsDown size={14} weight="bold" />
              </button>
            </div>
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

  const handleClearData = () => {
    if (confirm("Bạn có chắc muốn hủy hợp đồng và xóa sạch lịch sử phân tích khỏi hệ thống không? (Hành động này không thể hoàn tác)")) {
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: "Hợp đồng và toàn bộ dữ liệu phân tích đã được tiêu hủy an toàn khỏi máy chủ. Bạn cần hỗ trợ gì thêm không?",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    
    // Prepare history for backend
    const currentHistory = messages.map(m => ({ role: m.role, content: m.content }));
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const loadingMsg: Message = {
      id: botMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      loading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const isAnalyze = userMsg.content.toLowerCase().startsWith("/analyze");
      let apiUrl = "/api/chat";
      let bodyData: any = { message: userMsg.content, history: currentHistory };

      if (isAnalyze) {
        apiUrl = "/api/analyze";
        const parts = userMsg.content.split(" ");
        bodyData = { contractId: parts.length > 1 ? parts[1] : "default" };
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullContent = "";
      let currentThoughts: string[] = [];

      // Remove loading state once we start getting chunks
      setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, loading: false } : m));

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr.trim() === '[DONE]') {
              done = true;
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (isAnalyze) {
                if (data.status === "starting" || data.status === "running") {
                  if (data.message && !currentThoughts.includes(data.message)) {
                    currentThoughts = [...currentThoughts, data.message];
                    setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, thoughtProcess: currentThoughts } : m));
                  }
                } else if (data.status === "complete") {
                  // For simplicity, convert the result dict to a readable string
                  fullContent = "Analysis Complete:\n" + JSON.stringify(data.result, null, 2);
                  setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, content: fullContent } : m));
                }
              } else {
                // Normal Chat
                if (data.text) {
                  fullContent += data.text;
                  setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, content: fullContent } : m));
                }
              }
              if (data.error) {
                console.error("Backend returned error:", data.error);
                fullContent += "\n[Error: " + data.error + "]";
                setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, content: fullContent } : m));
              }
            } catch(e) {}
          }
        }
      }
    } catch(err) {
       console.error("Chat error:", err);
       setMessages((prev) => prev.map(m => m.id === botMsgId ? { ...m, loading: false, content: "Sorry, I encountered an error connecting to the backend." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background text-foreground">
      {/* Main chat column */}
      <div className="flex flex-col flex-1 overflow-hidden border-x border-border">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between p-5 border-b border-border shrink-0 bg-muted/10"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center border-2 border-foreground w-10 h-10 bg-foreground text-background">
              <Sparkle size={20} weight="bold" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest">
                ZenAI Operator
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 border border-emerald-900" />
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Online</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearData}
              title="Tiêu hủy dữ liệu"
              className="flex items-center gap-2 px-3 py-2 border-2 border-red-500 text-red-500 bg-background hover:bg-red-500/10 transition-colors"
            >
              <Trash size={14} weight="bold" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Hủy Dữ Liệu</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setModelOpen(!modelOpen)}
                className="flex items-center gap-2 px-3 py-2 border-2 border-foreground bg-background hover:bg-muted/10 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-widest">{selectedModel}</span>
                <CaretDown size={14} weight="bold" />
              </button>
              <AnimatePresence>
                {modelOpen && (
                  <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 flex flex-col bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                  style={{ minWidth: 200 }}
                >
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                      className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                        model === selectedModel
                          ? "bg-foreground text-background"
                          : "bg-background text-foreground hover:bg-muted/20"
                      }`}
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-background">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-6 py-3 flex gap-3 overflow-x-auto shrink-0 border-t border-border bg-muted/5">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 border border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground whitespace-nowrap shrink-0 transition-colors"
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
          className="p-6 border-t border-border bg-background shrink-0"
        >
          {/* Attached docs */}
          {attachedDocs.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {attachedDocs.map((doc) => (
               <div
                  key={doc.id}
                  className="flex items-center gap-2 px-3 py-1.5 border border-foreground bg-foreground/10 text-xs font-bold uppercase tracking-widest"
                >
                  <FileText size={14} weight="bold" />
                  {doc.name}
                  <button onClick={() => setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))}>
                    <X size={12} weight="bold" className="hover:text-destructive transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-4 p-4 border-2 border-foreground bg-background focus-within:ring-2 focus-within:ring-foreground/50 transition-all">
            <button className="shrink-0 mb-1 hover:text-muted-foreground transition-colors">
              <Paperclip size={20} weight="bold" />
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
              placeholder="ENTER COMMAND OR QUERY..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-xs font-mono font-bold placeholder:text-muted-foreground/50 uppercase leading-relaxed"
              style={{ minHeight: 24, maxHeight: 120 }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "24px";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <motion.button
              onClick={sendMessage}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || isLoading}
              className={`shrink-0 flex items-center justify-center p-2 border-2 transition-colors ${
                input.trim() && !isLoading
                  ? "border-foreground bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                  : "border-border bg-muted/20 text-muted-foreground cursor-not-allowed"
              }`}
            >
              <PaperPlaneRight size={20} weight="bold" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
