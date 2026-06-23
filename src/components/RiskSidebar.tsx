import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ShieldCheck, Loader2, Info } from "lucide-react";

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

export function RiskSidebar({ contractId, onExcerptClick }: RiskSidebarProps) {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const analyzeContract = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/contracts/${contractId}/analyze`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRisks(data.risks || []);
      setAnalyzed(true);
    } catch (err: any) {
      setError(err.message || "Failed to analyze contract");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "bg-red-500/10 border-red-500/30 text-red-400";
      case "MEDIUM": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "LOW": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      default: return "bg-slate-500/10 border-slate-500/30 text-slate-400";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0F1E] border-l border-white/5 w-96 shrink-0">
      <div className="p-5 border-b border-white/5">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" size={20} />
          AI Risk Analysis
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Tự động phát hiện các điều khoản bất lợi trong hợp đồng.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!analyzed && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <AlertTriangle className="text-indigo-400" size={28} />
            </div>
            <div>
              <p className="text-slate-300 font-medium">Chưa phân tích rủi ro</p>
              <p className="text-slate-500 text-sm mt-1 mb-4">
                Nhấn nút bên dưới để AI bắt đầu quét hợp đồng này.
              </p>
              <button
                onClick={analyzeContract}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Phân tích rủi ro ngay
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-slate-400 text-sm animate-pulse">AI đang đọc và phân tích...</p>
          </div>
        )}

        {analyzed && !loading && risks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShieldCheck className="text-emerald-400 mb-3" size={32} />
            <p className="text-slate-200">Không phát hiện rủi ro cao</p>
            <p className="text-slate-500 text-sm mt-1">Hợp đồng này có vẻ an toàn.</p>
          </div>
        )}

        {analyzed && !loading && risks.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Phát hiện {risks.length} vấn đề</span>
            </div>
            
            {risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border ${getSeverityColor(risk.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-snug">{risk.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 shrink-0 font-medium">
                    {risk.severity}
                  </span>
                </div>
                
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-slate-300">
                    <span className="text-white/60 font-medium block text-xs mb-1 uppercase tracking-wider">Giải thích</span>
                    {risk.explanation}
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3 relative group">
                    <span className="text-white/50 font-medium block text-xs mb-1">
                      Nguồn: {risk.location_meta.clause_number}
                    </span>
                    <p className="text-xs text-slate-400 italic line-clamp-3">"{risk.excerpt}"</p>
                    <button
                      onClick={() => onExcerptClick(risk.excerpt)}
                      className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <Info size={12} />
                      Xem tại nguồn gốc
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
