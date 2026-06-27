import { useState } from "react";
import { motion } from "motion/react";
import { Warning, ShieldCheck, Spinner, Info } from "@phosphor-icons/react";

interface Risk {
  id: string;
  category: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  explanation: string;
  excerpt: string;
  location_meta: {
    clause_number: string;
  };
}

interface RiskSidebarProps {
  contractId: string;
  onExcerptClick: (excerpt: string) => void;
}

export function BentoRiskSidebar({ contractId, onExcerptClick }: RiskSidebarProps) {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  const analyzeContract = async () => {
    setLoading(true);
    setError("");
    setAgentLogs([]);
    try {
      const res = await fetch(`/api/contracts/${contractId}/analyze`);
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let finalRisks = [];
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          const lines = chunkValue.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.status === 'starting' || data.status === 'running') {
                   setAgentLogs(prev => {
                     const msg = data.message || `[${data.node || 'System'}] Processing...`;
                     if (prev[prev.length - 1] !== msg) return [...prev, msg];
                     return prev;
                   });
                } else if (data.status === 'complete' && data.result) {
                   finalRisks = data.result.risks || [];
                } else if (data.error) {
                   setError(data.error);
                }
              } catch (e) {}
            }
          }
        }
      }
      setRisks(finalRisks);
      setAnalyzed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze contract");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "HIGH": return "border-destructive text-destructive bg-destructive/10";
      case "MEDIUM": return "border-amber-500 text-amber-500 bg-amber-500/10";
      case "LOW": return "border-emerald-500 text-emerald-500 bg-emerald-500/10";
      default: return "border-slate-100 text-slate-900 bg-slate-100";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100 shrink-0 text-slate-900" style={{ width: 320 }}>
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold font-medium flex items-center gap-2">
          <ShieldCheck size={20} weight="bold" className="text-slate-900" />
          Risk Analysis
        </h2>
        <p className="text-[10px] font-bold text-slate-500 font-medium mt-2">
          Automated clause extraction & risk assessment.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!analyzed && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div className="w-16 h-16 border border-slate-200/60 flex items-center justify-center bg-slate-50">
              <Warning size={32} weight="bold" />
            </div>
            <div>
              <p className="font-bold font-medium text-sm mb-2">No Analysis Run</p>
              <p className="text-[10px] font-mono text-slate-500 mb-6">
                System requires explicit clearance to begin document scan.
              </p>
              <button
                onClick={analyzeContract}
                className="px-6 py-3 bg-blue-600 text-white text-xs font-bold font-medium hover:bg-blue-600/90 transition-colors"
              >
                Initiate Scan
              </button>
            </div>
            {error && <p className="text-[10px] font-mono font-bold text-destructive border border-destructive p-2 mt-4 w-full">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col h-full gap-4 pb-4">
            <div className="flex flex-col items-center justify-center pt-10 gap-6">
              <Spinner size={32} weight="bold" className="animate-spin text-blue-600" />
              <p className="text-[10px] font-mono font-bold font-medium text-slate-500 animate-pulse">Scanning matrix...</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 mt-2 border border-slate-200 bg-slate-50 font-mono text-[10px] flex flex-col gap-2 rounded-lg mx-4">
              <div className="font-bold border-b border-slate-200 pb-2 mb-2 text-slate-900 flex items-center gap-2">
                <Info size={14} /> Agent Activity Log
              </div>
              {agentLogs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className="flex gap-2 text-slate-600"
                >
                  <span className="text-blue-600 font-bold">&gt;</span> {log}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {analyzed && !loading && risks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShieldCheck size={40} weight="bold" className="text-emerald-500 mb-4" />
            <p className="font-bold font-medium text-sm mb-2">No Critical Risks</p>
            <p className="text-[10px] font-mono text-slate-500">Document parameters are within acceptable thresholds.</p>
          </div>
        )}

        {analyzed && !loading && risks.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 font-medium">Detected Anomalies</span>
              <span className="text-[10px] font-mono font-bold">{risks.length}</span>
            </div>
            
            {risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 border ${getSeverityStyle(risk.severity)}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-xs font-medium leading-relaxed">{risk.title}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${getSeverityStyle(risk.severity)}`}>
                    {risk.severity}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold font-medium opacity-60 block mb-1">Context</span>
                    <div className="text-xs font-mono leading-relaxed opacity-90">
                      {risk.explanation}
                    </div>
                  </div>
                  
                  <div className="bg-white/50 border border-current/20 p-3 relative group">
                    <span className="text-[10px] font-bold font-medium opacity-50 block mb-2">
                      Source: {risk.location_meta.clause_number}
                    </span>
                    <p className="text-xs font-mono italic opacity-75 line-clamp-4 border-l-2 border-current/40 pl-3">&quot;{risk.excerpt}&quot;</p>
                    <button
                      onClick={() => onExcerptClick(risk.excerpt)}
                      className="mt-3 text-[10px] font-bold font-medium flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                      <Info size={14} weight="bold" />
                      Locate in document
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
