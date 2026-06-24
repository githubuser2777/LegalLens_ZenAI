import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Loader2, Search, Settings, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { RiskSidebar } from "./RiskSidebar";

interface ContractViewerProps {
  contractId: string;
  onClose: () => void;
}

export function ContractViewer({ contractId, onClose }: ContractViewerProps) {
  const [highlightText, setHighlightText] = useState("");
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [searchMatches, setSearchMatches] = useState(0);

  useEffect(() => {
    fetch(`/api/contracts/${contractId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setContract(data.contract);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [contractId]);

  const toc = useMemo(() => {
    if (!contract?.raw_text) return [];
    // Regex for: Điều 1, Article 2, Chương 3, Section 4
    const regex = /^(Điều \d+|Article \d+|Chương \d+|Section \d+)[:.]?\s*(.*)$/gmi;
    const items = [];
    let match;
    while ((match = regex.exec(contract.raw_text)) !== null) {
      items.push({
        id: `toc-${match.index}`,
        text: match[0].trim(),
      });
    }
    return items;
  }, [contract?.raw_text]);

  const { parts, matchCounter } = useMemo(() => {
    if (!contract?.raw_text) return { parts: [], matchCounter: 0 };
    
    let currentParts: any[] = [{ text: contract.raw_text, type: "normal" }];

    // 1. Headings
    const headingRegex = /^(Điều \d+|Article \d+|Chương \d+|Section \d+)[:.]?\s*(.*)$/gmi;
    currentParts = currentParts.flatMap(p => {
      if (p.type !== "normal") return [p];
      const chunks = [];
      let lastIndex = 0;
      let match;
      headingRegex.lastIndex = 0;
      while ((match = headingRegex.exec(p.text)) !== null) {
        if (match.index > lastIndex) {
          chunks.push({ text: p.text.substring(lastIndex, match.index), type: "normal" });
        }
        chunks.push({ 
          text: match[0], 
          type: "heading", 
          id: `toc-${match.index}` 
        });
        lastIndex = headingRegex.lastIndex;
      }
      if (lastIndex < p.text.length) {
        chunks.push({ text: p.text.substring(lastIndex), type: "normal" });
      }
      return chunks;
    });

    // 2. Risk Highlight
    if (highlightText) {
      currentParts = currentParts.flatMap(p => {
        if (p.type === "risk") return [p];
        const split = p.text.split(highlightText);
        const chunks = [];
        split.forEach((s, i) => {
          if (s) chunks.push({ ...p, text: s });
          if (i < split.length - 1) {
            chunks.push({ text: highlightText, type: "risk", originalType: p.type, id: p.id });
            p.id = undefined; 
          }
        });
        return chunks;
      });
    }

    // 3. Search Query
    let counter = 0;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      currentParts = currentParts.flatMap(p => {
        if (p.type === "search" || p.type === "risk") return [p];
        const lowerText = p.text.toLowerCase();
        const chunks = [];
        let startIndex = 0;
        let index;
        while ((index = lowerText.indexOf(lowerQuery, startIndex)) > -1) {
          if (index > startIndex) {
            chunks.push({ ...p, text: p.text.substring(startIndex, index) });
          }
          chunks.push({ 
            text: p.text.substring(index, index + searchQuery.length), 
            type: "search",
            searchIndex: counter++,
            originalType: p.type,
            id: p.id
          });
          p.id = undefined;
          startIndex = index + searchQuery.length;
        }
        if (startIndex < p.text.length) {
          chunks.push({ ...p, text: p.text.substring(startIndex) });
        }
        return chunks;
      });
    }

    return { parts: currentParts, matchCounter: counter };
  }, [contract?.raw_text, highlightText, searchQuery]);

  useEffect(() => {
    setSearchMatches(matchCounter);
  }, [matchCounter]);

  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (searchMatches > 0 && searchQuery) {
      const el = document.getElementById(`search-match-${currentMatchIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentMatchIndex, searchMatches, searchQuery]);

  useEffect(() => {
    if (highlightText) {
      setTimeout(() => {
        const el = document.getElementById("highlight-target");
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightText]);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('bg-indigo-500/30', 'transition-colors', 'duration-300', 'rounded');
      setTimeout(() => {
        el.classList.remove('bg-indigo-500/30', 'transition-colors', 'duration-300', 'rounded');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-400 text-sm">{error || "Contract not found"}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#080B14]">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          background: "rgba(12,15,30,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "#94A3B8" }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <FileText size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 line-clamp-1">{contract.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Imported on {new Date(contract.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-64"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search document text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder-slate-500"
            />
            {searchMatches > 0 && searchQuery && (
              <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                <span>{currentMatchIndex + 1}/{searchMatches}</span>
                <button 
                  onClick={() => setCurrentMatchIndex(prev => Math.max(0, prev - 1))}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors"
                >
                  <ArrowUp size={12} />
                </button>
                <button 
                  onClick={() => setCurrentMatchIndex(prev => Math.min(searchMatches - 1, prev + 1))}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            )}
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
            <Filter size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: TOC Sidebar */}
        <div className="w-64 shrink-0 overflow-y-auto p-6" style={{ background: "rgba(12,15,30,0.4)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Mục lục</h3>
          <div className="flex flex-col gap-3">
            {toc.map(item => (
              <button 
                key={item.id} 
                onClick={() => scrollToElement(item.id)}
                className="text-left text-sm text-slate-300 hover:text-indigo-400 transition-colors line-clamp-2 leading-relaxed"
              >
                {item.text}
              </button>
            ))}
            {toc.length === 0 && <p className="text-xs text-slate-500">Không tìm thấy mục lục.</p>}
          </div>
        </div>

        {/* Center: Document text */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl"
          >
            <div
              className="rounded-xl overflow-hidden relative"
              style={{
                background: "#0C0F1E",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Page header styling */}
              <div
                className="h-8 w-full flex items-center px-4"
                style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>
              
              <div className="p-10 font-mono text-sm leading-relaxed relative whitespace-pre-wrap" style={{ color: "#E2E8F0" }}>
                {parts.map((p, i) => {
                  let className = "";
                  if (p.type === "risk") {
                    className = "bg-red-500/30 text-white rounded px-1 animate-pulse inline-block";
                  } else if (p.type === "search") {
                    className = p.searchIndex === currentMatchIndex 
                      ? "bg-orange-500/80 text-white rounded px-1 shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                      : "bg-yellow-500/40 text-white rounded px-1 cursor-pointer";
                  } else if (p.type === "heading" || p.originalType === "heading") {
                    className = "font-bold text-indigo-300";
                  }

                  const props: any = { key: i };
                  if (className) props.className = className;
                  if (p.id) props.id = p.id;
                  if (p.type === "search" && p.searchIndex !== undefined) {
                    props.id = `search-match-${p.searchIndex}`;
                    props.onClick = () => setCurrentMatchIndex(p.searchIndex);
                  }
                  
                  let isFirstRisk = p.type === "risk" && parts.findIndex(x => x.type === "risk") === i;
                  if (isFirstRisk) {
                    props.id = "highlight-target";
                  }

                  return <span {...props}>{p.text}</span>;
                })}
                {!contract.raw_text && (
                  <p className="text-slate-500 italic">No text could be extracted from this document.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Risk Sidebar */}
        <RiskSidebar 
          contractId={contractId} 
          onExcerptClick={(excerpt) => {
            setHighlightText(excerpt);
          }} 
        />
      </div>
    </div>
  );
}
