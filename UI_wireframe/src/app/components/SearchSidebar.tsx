import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Tag,
  Calendar,
  Sparkles,
  FileText,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Slider } from "./ui/slider";

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

const ALL_TAGS = ["NDA", "Contract", "IP", "Employment", "License", "Merger", "Compliance", "Liability", "IP Rights", "Arbitration"];
const AI_KEYWORDS = ["Force Majeure", "Indemnification", "Confidentiality", "Non-compete", "Termination Clause", "Governing Law"];

const RESULTS = [
  {
    id: 1,
    title: "NDA — Merriweather Corp",
    type: "NDA",
    date: "Jun 14, 2026",
    confidence: 97,
    snippet:
      "…the receiving party shall not disclose any <mark>Confidential Information</mark> to third parties without prior written consent…",
    tags: ["NDA", "Confidentiality"],
  },
  {
    id: 2,
    title: "Service Agreement — TechVentures",
    type: "Contract",
    date: "Jun 12, 2026",
    confidence: 91,
    snippet:
      "…in the event of <mark>Force Majeure</mark>, neither party shall be liable for delays resulting from circumstances beyond reasonable control…",
    tags: ["Contract", "Force Majeure"],
  },
  {
    id: 3,
    title: "IP Assignment — Founders",
    type: "IP",
    date: "Jun 10, 2026",
    confidence: 84,
    snippet:
      "…all intellectual property created during the term shall vest in the Company, including but not limited to <mark>IP Rights</mark>…",
    tags: ["IP", "IP Rights"],
  },
  {
    id: 4,
    title: "Employment Agreement — Q2 Batch",
    type: "Employment",
    date: "Jun 8, 2026",
    confidence: 96,
    snippet:
      "…employee shall not engage in any activity that constitutes <mark>Non-compete</mark> for a period of 24 months post-employment…",
    tags: ["Employment", "Non-compete"],
  },
  {
    id: 5,
    title: "Merger Term Sheet — Alpha Ventures",
    type: "Merger",
    date: "Jun 6, 2026",
    confidence: 89,
    snippet:
      "…the <mark>Indemnification</mark> obligations of the Seller shall survive closing for a period of 36 months…",
    tags: ["Merger", "Indemnification"],
  },
];

export function SearchSidebar() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["NDA", "Contract"]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(["Force Majeure"]);
  const [confidenceRange, setConfidenceRange] = useState([75]);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const toggleKeyword = (kw: string) =>
    setSelectedKeywords((prev) => (prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]));

  const filtered = RESULTS.filter((r) => {
    const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
    const matchesTags = selectedTags.length === 0 || r.tags.some((t) => selectedTags.includes(t));
    const matchesConfidence = r.confidence >= confidenceRange[0];
    return matchesQuery && matchesTags && matchesConfidence;
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Filter sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 p-4 overflow-y-auto shrink-0"
        style={{
          width: 264,
          background: "rgba(12,15,30,0.6)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: "#A78BFA" }} />
            <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
              Filters
            </span>
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)}>
            {filtersOpen ? (
              <ChevronUp size={14} style={{ color: "#64748B" }} />
            ) : (
              <ChevronDown size={14} style={{ color: "#64748B" }} />
            )}
          </button>
        </div>

        {filtersOpen && (
          <>
            {/* Tags */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={12} style={{ color: "#64748B" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
                  Document Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="text-xs px-2 py-0.5 rounded-full transition-all duration-150"
                    style={
                      selectedTags.includes(tag)
                        ? {
                            background: "rgba(124,58,237,0.25)",
                            color: "#A78BFA",
                            border: "1px solid rgba(124,58,237,0.4)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "#64748B",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Date range */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar size={12} style={{ color: "#64748B" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
                  Date Range
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {["Last 7 days", "Last 30 days", "Last 90 days", "Custom…"].map((opt) => (
                  <button
                    key={opt}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors duration-150"
                    style={
                      opt === "Last 30 days"
                        ? {
                            background: "rgba(124,58,237,0.2)",
                            color: "#A78BFA",
                            border: "1px solid rgba(124,58,237,0.3)",
                          }
                        : { color: "#94A3B8" }
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* AI Keywords */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} style={{ color: "#06B6D4" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
                  AI Keywords
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {AI_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between group transition-colors duration-150"
                    style={
                      selectedKeywords.includes(kw)
                        ? {
                            background: "rgba(6,182,212,0.1)",
                            color: "#67E8F9",
                            border: "1px solid rgba(6,182,212,0.2)",
                          }
                        : { color: "#94A3B8" }
                    }
                  >
                    {kw}
                    {selectedKeywords.includes(kw) && (
                      <X size={10} style={{ color: "#67E8F9" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
                  Min. AI Confidence
                </span>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "#A78BFA" }}>
                  {confidenceRange[0]}%
                </span>
              </div>
              <Slider
                value={confidenceRange}
                onValueChange={setConfidenceRange}
                min={50}
                max={99}
                step={1}
              />
            </div>
          </>
        )}
      </motion.aside>

      {/* Results pane */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#64748B" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, clauses, parties…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F1F5F9",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")
              }
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs" style={{ color: "#64748B" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs px-2 py-0.5 rounded"
                style={{ color: "#A78BFA", background: "rgba(124,58,237,0.1)" }}
              >
                Clear tags
              </button>
            )}
          </div>
        </motion.div>

        {/* Result list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filtered.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -1 }}
              className="p-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                ...GLASS,
                boxShadow: "0 0 0 transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 24px rgba(124,58,237,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 transparent")
              }
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={13} style={{ color: "#7C3AED", flexShrink: 0 }} />
                  <span className="text-sm font-semibold truncate" style={{ color: "#F1F5F9" }}>
                    {result.title}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold tabular-nums shrink-0 ml-2"
                  style={{
                    color:
                      result.confidence >= 90 ? "#34D399" : result.confidence >= 80 ? "#FCD34D" : "#F87171",
                  }}
                >
                  {result.confidence}%
                </span>
              </div>

              <p
                className="text-xs mb-2 leading-relaxed"
                style={{ color: "#94A3B8" }}
                dangerouslySetInnerHTML={{
                  __html: result.snippet.replace(
                    /<mark>(.*?)<\/mark>/g,
                    '<mark style="background:rgba(124,58,237,0.25);color:#C4B5FD;padding:0 2px;border-radius:3px;">$1</mark>'
                  ),
                }}
              />

              <div className="flex items-center gap-2 flex-wrap">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#64748B" }}
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs ml-auto" style={{ color: "#475569" }}>
                  {result.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
