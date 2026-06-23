import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Loader2, Search, Settings, Filter } from "lucide-react";
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
        {/* Left: Document text */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
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
              
              <div className="p-10 font-mono text-sm leading-relaxed relative" style={{ color: "#E2E8F0" }}>
                {contract.raw_text ? (
                  <div className="whitespace-pre-wrap">
                    {highlightText ? (
                      <>
                        {contract.raw_text.split(highlightText).map((part: string, i: number, arr: string[]) => (
                          <span key={i}>
                            {part}
                            {i !== arr.length - 1 && (
                              <mark
                                id="highlight-target"
                                className="bg-red-500/30 text-white rounded px-1 animate-pulse inline-block scroll-mt-32"
                                ref={(el) => {
                                  if (el && i === 0) {
                                    // Scroll to the first match
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                }}
                              >
                                {highlightText}
                              </mark>
                            )}
                          </span>
                        ))}
                      </>
                    ) : (
                      contract.raw_text
                    )}
                  </div>
                ) : (
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
