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
} from "@phosphor-icons/react";

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
    content: "Hi! I am the ZenAI Operator. How can I assist you with your legal documents today?",
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
      <span className="w-2 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
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
        className={`flex items-center justify-center border border-slate-200/60 shrink-0 text-xs font-bold font-medium mt-1 ${
          isUser ? "bg-blue-600 text-white" : "bg-white text-slate-900"
        }`}
        style={{ width: 40, height: 40 }}
      >
        {isUser ? "JD" : <Sparkle size={20} weight="bold" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`p-4 border border-slate-200/60 ${
            isUser ? "bg-blue-600/5" : "bg-slate-50"
          }`}
        >
          {message.loading ? <LoadingDots /> : lines.map((line, i) => renderLine(line, i))}
        </div>

        <div className={`flex items-center gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] font-mono font-bold text-slate-500 border border-slate-100 px-1.5 py-0.5">
            {message.timestamp}
          </span>
          {!isUser && !message.loading && (
            <div className="flex gap-2">
              <button className="p-1 border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <Copy size={14} weight="bold" />
              </button>
              <button className="p-1 border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <ThumbsUp size={14} weight="bold" />
              </button>
              <button className="p-1 border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <ThumbsDown size={14} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function BentoAIChat() {
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    const history = messages.filter(m => !m.loading).map(m => ({
        role: m.role,
        content: m.content
    }));

    const assistantMsgId = (Date.now() + 1).toString();
    const loadingMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      loading: true,
    };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: input, history })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        
        let assistantContent = "";
        setMessages((prev) => prev.map(m => m.id === assistantMsgId ? { ...m, loading: false } : m));

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const chunkStr = decoder.decode(value, { stream: true });
                const lines = chunkStr.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') {
                            done = true;
                            break;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                assistantContent += data.text;
                                setMessages((prev) => 
                                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                                );
                            } else if (data.error) {
                                assistantContent += "\n\nError: " + data.error;
                                setMessages((prev) => 
                                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                                );
                            }
                        } catch(e) {
                            console.error("Parse error", e);
                        }
                    }
                }
            }
        }
    } catch (e: any) {
        setMessages((prev) => prev.map(m => m.id === assistantMsgId ? { ...m, loading: false, content: "Error connecting to AI: " + e.message } : m));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-white text-slate-900">
      {/* Main chat column */}
      <div className="flex flex-col flex-1 overflow-hidden border-x border-slate-100">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center border border-slate-200/60 w-10 h-10 bg-blue-600 text-white">
              <Sparkle size={20} weight="bold" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-medium">
                ZenAI Operator
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 border border-emerald-900" />
                <span className="text-[10px] font-mono font-bold text-slate-500 ">Scheduled: Wk8</span>
              </div>
            </div>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200/60 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs font-bold font-medium">{selectedModel}</span>
              <CaretDown size={14} weight="bold" />
            </button>
            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 flex flex-col bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50"
                  style={{ minWidth: 200 }}
                >
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                      className={`text-left px-4 py-3 text-xs font-bold font-medium transition-colors ${
                        model === selectedModel
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-900 hover:bg-slate-50"
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-white">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-6 py-3 flex gap-3 overflow-x-auto shrink-0 border-t border-slate-100 bg-slate-50">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-[10px] font-bold font-medium px-3 py-2 border border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-900 whitespace-nowrap shrink-0 transition-colors"
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
          className="p-6 border-t border-slate-100 bg-white shrink-0"
        >
          {/* Attached docs */}
          {attachedDocs.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {attachedDocs.map((doc) => (
               <div
                  key={doc.id}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-blue-600/10 text-xs font-bold font-medium"
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

          <div className="flex items-end gap-4 p-4 border border-slate-200/60 bg-white focus-within:ring-2 focus-within:ring-foreground/50 transition-all">
            <button className="shrink-0 mb-1 hover:text-slate-500 transition-colors">
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
              className="flex-1 resize-none bg-transparent outline-none text-xs font-mono font-bold placeholder:text-slate-500/50  leading-relaxed"
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
                  ? "border-slate-200 bg-blue-600 text-white hover:bg-blue-600/90 cursor-pointer"
                  : "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
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
