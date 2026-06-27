import { motion } from "motion/react";
import {
  FileText,
  TrendUp,
  CheckCircle,
  WarningCircle,
  ArrowUpRight,
  Plus,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
        status === "complete"
          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
          : "bg-amber-50 text-amber-600 border border-amber-200"
      }`}
    >
      {status === "complete" ? <CheckCircle size={14} weight="fill" /> : <WarningCircle size={14} weight="fill" />}
      {status === "complete" ? "Complete" : "Review"}
    </span>
  );
}

interface Contract {
  id: string;
  title: string;
  created_at: string;
}

export function BentoDashboard({ onViewDocument, onUploadClick, userEmail }: { onViewDocument?: (id: string) => void, onUploadClick?: () => void, userEmail?: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch('/api/contracts')
      .then(res => res.json())
      .then(data => {
        if (data.contracts) setContracts(data.contracts);
      })
      .catch(console.error);
  }, []);

  const summaryCards = [
    {
      label: "Documents Processed",
      value: contracts.length.toString(),
      delta: `+${contracts.length} this week`,
      icon: FileText,
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f9fafb] text-[#0f172a] overflow-y-auto font-sans p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl tracking-tight font-semibold text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {userEmail?.split('@')[0] || "User"}
          </p>
        </div>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-2xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} weight="bold" />
          New Document
        </button>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        
        {/* Metric Cards (Col span 4) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                layoutId={`card-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex flex-col relative overflow-hidden group"
              >
                {/* Micro-interaction background element */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-500">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors cursor-pointer">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {card.label}
                  </p>
                  <p className="text-5xl font-semibold tracking-tight text-slate-900 mb-4">
                    {card.value}
                  </p>
                </div>
                
                <div className="mt-auto relative z-10">
                  <p className="text-sm font-medium text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-max px-3 py-1.5 rounded-full">
                    <TrendUp size={16} weight="bold" />
                    {card.delta}
                  </p>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex-1 min-h-[240px] flex flex-col relative overflow-hidden group"
          >
             <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-50 rounded-full blur-3xl group-hover:bg-purple-100 transition-colors duration-500" />
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-slate-500 mb-6">Weekly Activity</h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {(() => {
                    const counts = [0, 0, 0, 0, 0, 0, 0];
                    contracts.forEach(contract => {
                      const date = new Date(contract.created_at);
                      const day = date.getDay();
                      counts[day === 0 ? 6 : day - 1]++;
                    });
                    const max = Math.max(...counts, 1);
                    return counts.map((count, idx) => {
                      const h = Math.max((count / max) * 100, count === 0 ? 4 : 10);
                      return (
                        <motion.div 
                          key={idx}
                          whileHover={{ scaleY: 1.05 }}
                          className="w-full bg-slate-100 rounded-t-lg origin-bottom cursor-pointer hover:bg-blue-500 transition-colors relative group/bar"
                          style={{ height: `${h}%` }}
                        >
                          {count > 0 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                              {count}
                            </div>
                          )}
                        </motion.div>
                      );
                    });
                  })()}
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium text-slate-400">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Registry (Col span 8) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
          className="md:col-span-8 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-8 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Documents</h3>
              <p className="text-sm text-slate-500 mt-1">Review and manage your processed contracts</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {["Document", "Type", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-medium text-slate-400 bg-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contracts.map((doc, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.05) }}
                    key={doc.id}
                    onClick={() => onViewDocument && onViewDocument(doc.id)}
                    className="group cursor-pointer hover:bg-slate-50/80 transition-colors rounded-2xl"
                  >
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-blue-500 group-hover:shadow-sm transition-all">
                          <FileText size={20} weight="duotone" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate max-w-[250px]">
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                        PDF
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={"complete"} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 rounded-r-2xl">
                      {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </motion.tr>
                ))}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                          <FileText size={32} weight="duotone" />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-4">No documents processed yet</p>
                        <button onClick={onUploadClick} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                          Upload your first document
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
