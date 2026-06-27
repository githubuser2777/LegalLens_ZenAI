import { motion } from "motion/react";
import {
  FileText,
  TrendUp,
  CheckCircle,
  WarningCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

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

  const yLabels = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
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
              stroke="var(--border)"
              strokeDasharray="2 2"
            />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize={10} className="fill-muted-foreground font-mono">
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
              className={`transition-colors duration-150 cursor-pointer ${isHov ? "fill-foreground" : "fill-muted-foreground"}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {isHov && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={10} className="fill-foreground font-bold font-mono">
                {d.docs}
              </text>
            )}
            <text x={x + barW / 2} y={padT + innerH + 16} textAnchor="middle" fontSize={10} className="fill-muted-foreground uppercase font-bold tracking-widest">
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
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border ${
        status === "complete"
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
      }`}
    >
      {status === "complete" ? <CheckCircle size={12} weight="bold" /> : <WarningCircle size={12} weight="bold" />}
      {status === "complete" ? "Complete" : "Review"}
    </span>
  );
}

interface Contract {
  id: string;
  title: string;
  created_at: string;
}

export function Dashboard({ onViewDocument, onUploadClick, userEmail }: { onViewDocument?: (id: string) => void, onUploadClick?: () => void, userEmail?: string }) {
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

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map(day => ({ day, docs: 0 }));
  contracts.forEach(c => {
     const dayName = new Date(c.created_at).toLocaleDateString("en-US", { weekday: 'short' });
     const target = chartData.find(d => d.day === dayName);
     if (target) target.docs++;
  });

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between p-6 border-b border-border bg-background"
      >
        <div>
          <h1 className="text-xl font-medium tracking-tight">
            Good morning, {userEmail?.split('@')[0] || "User"}
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-semibold">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-bold bg-foreground text-background hover:bg-zinc-200 transition-colors active:scale-[0.98]"
        >
          <FileText size={16} weight="bold" />
          Ingest Document
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border flex-1 border-b border-border">
        {/* Left Col: Chart & Summary */}
        <div className="md:col-span-4 flex flex-col divide-y divide-border border-r border-border bg-background">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="p-8 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-8 text-muted-foreground">
                  <Icon size={24} weight="light" />
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-5xl font-mono tracking-tighter text-foreground mb-2">
                    {card.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    {card.label}
                  </p>
                </div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mt-4 flex items-center gap-1.5">
                  <TrendUp size={12} weight="bold" />
                  {card.delta}
                </p>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.28 }}
            className="p-6 flex-1 flex flex-col justify-end min-h-[240px]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
                  Ingestion Volume
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 border border-border text-muted-foreground">
                7-day
              </span>
            </div>
            <div className="mt-auto">
              <BarChart data={chartData} />
            </div>
          </motion.div>
        </div>

        {/* Right Col: Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          className="md:col-span-8 p-0 bg-background"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Document Registry
            </h3>
            <button className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {["Identifier", "Format", "Status", "Timestamp"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border bg-muted/20"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onViewDocument && onViewDocument(doc.id)}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText size={16} weight="light" className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono border border-border px-1.5 py-0.5 text-muted-foreground bg-background">
                        PDF
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={"complete"} />
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {new Date(doc.created_at).toISOString().split('T')[0]}
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">No documents registered</p>
                      <button onClick={onUploadClick} className="text-xs uppercase tracking-widest font-bold text-foreground hover:underline">
                        Initialize Ingestion →
                      </button>
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
