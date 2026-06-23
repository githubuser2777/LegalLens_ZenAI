import { motion } from "motion/react";
import {
  FileText,
  Brain,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};
function BarChart({ data }: { data: { day: string; docs: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.docs), 1);

  const W = 480;
  const H = 160;
  const padL = 28;
  const padR = 12;
  const padT = 8;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const barW = (innerW / data.length) * 0.55;
  const gap = innerW / data.length;

  // Y-axis labels: 0, mid, max
  const yLabels = [0, Math.round(max / 2), max];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ overflow: "visible" }}
    >
      {/* Grid lines */}
      {yLabels.map((v, i) => {
        const y = padT + innerH - (v / max) * innerH;
        return (
          <g key={`grid-${i}`}>
            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />
            <text
              x={padL - 4}
              y={y + 4}
              textAnchor="end"
              fontSize={10}
              fill="#475569"
            >
              {v}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.docs / max) * innerH;
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + innerH - barH;
        const isHov = hovered === i;
        return (
          <g key={`bar-${d.day}`}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={isHov ? "#A78BFA" : "rgba(124,58,237,0.55)"}
              style={{ transition: "fill 0.15s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {isHov && (
              <text
                x={x + barW / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="#A78BFA"
              >
                {d.docs}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={padT + innerH + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#475569"
            >
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={
        status === "complete"
          ? { background: "rgba(16,185,129,0.15)", color: "#34D399", border: "1px solid rgba(16,185,129,0.25)" }
          : { background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.25)" }
      }
    >
      {status === "complete" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
      {status === "complete" ? "Complete" : "Review"}
    </span>
  );
}

function ConfidencePill({ score }: { score: number }) {
  const color = score >= 90 ? "#34D399" : score >= 80 ? "#FCD34D" : "#F87171";
  return (
    <span className="text-xs font-semibold tabular-nums" style={{ color }}>
      {score}%
    </span>
  );
}

export function Dashboard({ onViewDocument, onUploadClick, userEmail }: { onViewDocument?: (id: string) => void, onUploadClick?: () => void, userEmail?: string }) {
  const [contracts, setContracts] = useState<any[]>([]);

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
      gradient: "linear-gradient(135deg, #7C3AED, #4F46E5)",
      glow: "rgba(124,58,237,0.2)",
    }
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map(day => ({ day, docs: 0 }));
  contracts.forEach(c => {
     const dayName = new Date(c.created_at).toLocaleDateString("en-US", { weekday: 'short' });
     const target = chartData.find(d => d.day === dayName);
     if (target) target.docs++;
  });

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}>
            Good morning, {userEmail?.split('@')[0] || "User"}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
        >
          <FileText size={14} />
          Upload Document
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: `0 0 40px ${card.glow}` }}
              className="flex flex-col gap-4 p-5 cursor-default transition-shadow duration-200"
              style={{ ...GLASS, boxShadow: `0 0 0px ${card.glow}` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, background: card.gradient, boxShadow: `0 0 16px ${card.glow}` }}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <ArrowUpRight size={14} style={{ color: "#475569" }} />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums" style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}>
                  {card.value}
                </p>
                <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "#94A3B8", fontWeight: 400 }}>
                  {card.label}
                </p>
              </div>
              <p className="text-xs" style={{ color: "#64748B" }}>
                <TrendingUp size={10} className="inline mr-1 mb-0.5" />
                {card.delta}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Activity row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Processing chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="p-5"
          style={GLASS}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                Processing Volume
              </h3>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Documents analysed this week
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              7-day
            </span>
          </div>
          <BarChart data={chartData} />
        </motion.div>


      </div>

      {/* Recent documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.42 }}
        className="p-5"
        style={GLASS}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
            Recent Documents
          </h3>
          <button className="text-xs" style={{ color: "#A78BFA" }}>
            View all →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              {["Document", "Type", "Confidence", "Status", "Time"].map((h) => (
                <th
                  key={h}
                  className="text-left pb-3 text-xs uppercase tracking-wider"
                  style={{ color: "#475569", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((doc, i) => (
              <tr
                key={doc.id}
                onClick={() => onViewDocument && onViewDocument(doc.id)}
                className="transition-colors duration-100 cursor-pointer"
                style={{ borderBottom: i < contracts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <FileText size={13} style={{ color: "#7C3AED", flexShrink: 0 }} />
                    <span className="text-xs truncate max-w-[180px]" style={{ color: "#CBD5E1" }}>
                      {doc.title}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.07)", color: "#94A3B8" }}
                  >
                    PDF
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-slate-500">N/A</span>
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={"complete"} />
                </td>
                <td className="py-3">
                  <span className="text-xs" style={{ color: "#475569" }}>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
            {contracts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs" style={{ color: "#64748B" }}>
                  No documents found. Upload one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
