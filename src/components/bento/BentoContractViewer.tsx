import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Spinner, MagnifyingGlass, Gear, Funnel, CaretUp, CaretDown } from "@phosphor-icons/react";
import { BentoRiskSidebar } from "./BentoRiskSidebar";

interface ContractViewerProps {
  contractId: string;
  onClose: () => void;
}

export function BentoContractViewer({ contractId, onClose }: ContractViewerProps) {
  const [highlightText, setHighlightText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [contract]);

  const { parts, matchCounter } = useMemo(() => {
    if (!contract?.raw_text) return { parts: [], matchCounter: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [contract, highlightText, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchMatches(matchCounter);
  }, [matchCounter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      el.classList.add('bg-blue-600/20', 'transition-colors', 'duration-300');
      setTimeout(() => {
        el.classList.remove('bg-blue-600/20', 'transition-colors', 'duration-300');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-white">
        <Spinner className="animate-spin text-slate-900" size={32} weight="bold" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-6 bg-white">
        <p className="text-destructive font-mono font-bold text-sm font-medium border-2 border-destructive p-4">{error || "Contract not found"}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 border border-slate-200/60 text-slate-900 hover:bg-blue-600 hover:text-white text-xs font-bold font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-slate-900">
      {/* Header bar */}
      <div className="flex items-center justify-between p-6 shrink-0 border-b-2 border-slate-200 bg-slate-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 border border-slate-200/60 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 border border-slate-200/60 bg-blue-600 text-white shrink-0">
              <FileText size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-medium line-clamp-1">{contract.title}</h2>
              <p className="text-[10px] font-mono text-slate-500 mt-1 ">
                Imported: {new Date(contract.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 border border-slate-200/60 bg-white focus-within:ring-2 focus-within:ring-foreground/50 transition-all w-80">
            <MagnifyingGlass size={16} weight="bold" className="text-slate-500" />
            <input
              type="text"
              placeholder="SEARCH DOCUMENT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono font-bold w-full placeholder:text-slate-500 "
            />
            {searchMatches > 0 && searchQuery && (
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 shrink-0 border-l-2 border-slate-200 pl-3">
                <span>{currentMatchIndex + 1}/{searchMatches}</span>
                <button 
                  onClick={() => setCurrentMatchIndex(prev => Math.max(0, prev - 1))}
                  className="hover:text-slate-900 transition-colors"
                >
                  <CaretUp size={14} weight="bold" />
                </button>
                <button 
                  onClick={() => setCurrentMatchIndex(prev => Math.min(searchMatches - 1, prev + 1))}
                  className="hover:text-slate-900 transition-colors"
                >
                  <CaretDown size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
          <button className="p-3 border border-slate-200/60 bg-white hover:bg-blue-600 hover:text-white transition-colors">
            <Funnel size={16} weight="bold" />
          </button>
          <button className="p-3 border border-slate-200/60 bg-white hover:bg-blue-600 hover:text-white transition-colors">
            <Gear size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: TOC Sidebar */}
        <div className="w-72 shrink-0 overflow-y-auto p-6 border-r border-slate-100 bg-slate-50">
          <h3 className="text-xs font-bold font-medium text-slate-500 mb-6">Table of Contents</h3>
          <div className="flex flex-col gap-4 border-l-2 border-slate-100 pl-4">
            {toc.map(item => (
              <button 
                key={item.id} 
                onClick={() => scrollToElement(item.id)}
                className="text-left text-xs font-bold font-medium text-slate-900/70 hover:text-slate-900 transition-colors line-clamp-2"
              >
                {item.text}
              </button>
            ))}
            {toc.length === 0 && <p className="text-[10px] font-mono font-bold text-slate-500 ">No structure detected.</p>}
          </div>
        </div>

        {/* Center: Document text */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center scroll-smooth bg-slate-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 dark:shadow-lg shadow-slate-200/50 relative">
              {/* Page header styling */}
              <div className="h-10 w-full flex items-center px-4 border-b-2 border-slate-200 bg-slate-50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 border border-slate-200/60 bg-white" />
                  <div className="w-3 h-3 border border-slate-200/60 bg-white" />
                  <div className="w-3 h-3 border border-slate-200/60 bg-white" />
                </div>
              </div>
              
              <div className="p-12 font-mono text-sm leading-loose relative whitespace-pre-wrap selection:bg-blue-600/20">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {parts.map((p: any, i: number) => {
                  let className = "";
                  if (p.type === "risk") {
                    className = "bg-destructive/20 text-destructive border-b-2 border-destructive px-1 animate-pulse inline-block";
                  } else if (p.type === "search") {
                    className = p.searchIndex === currentMatchIndex 
                      ? "bg-blue-600 text-white font-bold px-1" 
                      : "bg-blue-600/20 text-slate-900 font-bold px-1 cursor-pointer";
                  } else if (p.type === "heading" || p.originalType === "heading") {
                    className = "font-bold text-base font-medium bg-slate-50 px-2 py-1 inline-block my-2";
                  }

                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const props: any = {};
                  if (className) props.className = className;
                  if (p.id) props.id = p.id;
                  if (p.type === "search" && p.searchIndex !== undefined) {
                    props.id = `search-match-${p.searchIndex}`;
                    props.onClick = () => setCurrentMatchIndex(p.searchIndex);
                  }
                  
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const isFirstRisk = p.type === "risk" && parts.findIndex((x: any) => x.type === "risk") === i;
                  if (isFirstRisk) {
                    props.id = "highlight-target";
                  }

                  return <span key={i} {...props}>{p.text}</span>;
                })}
                {!contract.raw_text && (
                  <p className="text-[10px] font-mono font-bold text-slate-500  text-center mt-10">No text payload recovered from document source.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Risk Sidebar */}
        <BentoRiskSidebar 
          contractId={contractId} 
          onExcerptClick={(excerpt) => {
            setHighlightText(excerpt);
          }} 
        />
      </div>
    </div>
  );
}
