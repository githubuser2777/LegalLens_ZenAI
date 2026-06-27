import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MagnifyingGlass,
  Tag,
  CalendarBlank,
  Sparkle,
  FileText,
  X,
  SlidersHorizontal,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { Slider } from "./ui/slider";

const ALL_TAGS = ["NDA", "Contract", "IP", "Employment", "License", "Merger", "Compliance", "Liability", "IP Rights", "Arbitration"];
const AI_KEYWORDS = ["Force Majeure", "Indemnification", "Confidentiality", "Non-compete", "Termination Clause", "Governing Law"];

interface Contract {
  id: string;
  title: string;
  created_at: string;
}

export function SearchSidebar() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [confidenceRange, setConfidenceRange] = useState([75]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch('/api/contracts')
      .then(res => res.json())
      .then(data => {
        if (data.contracts) setContracts(data.contracts);
      })
      .catch(console.error);
  }, []);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const toggleKeyword = (kw: string) =>
    setSelectedKeywords((prev) => (prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]));

  const filtered = contracts.filter((r) => {
    const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="flex h-full overflow-hidden bg-background text-foreground">
      {/* Filter sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-6 p-6 overflow-y-auto shrink-0 border-r border-border bg-muted/10"
        style={{ width: 280 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} weight="bold" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Filters
            </span>
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="text-muted-foreground hover:text-foreground transition-colors">
            {filtersOpen ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
          </button>
        </div>

        {filtersOpen && (
          <div className="flex flex-col gap-6">
            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} weight="bold" className="text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Document Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 border transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Date range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarBlank size={14} weight="bold" className="text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Date Range
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {["Last 7 days", "Last 30 days", "Last 90 days", "Custom…"].map((opt) => (
                  <button
                    key={opt}
                    className={`text-left text-xs font-semibold px-3 py-2 border transition-colors ${
                      opt === "Last 30 days"
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-transparent hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* AI Keywords */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkle size={14} weight="bold" className="text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  AI Keywords
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {AI_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`text-left text-xs font-semibold px-3 py-2 border flex items-center justify-between group transition-colors ${
                      selectedKeywords.includes(kw)
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-transparent hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    {kw}
                    {selectedKeywords.includes(kw) && (
                      <X size={12} weight="bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Min. AI Confidence
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
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
          </div>
        )}
      </motion.aside>

      {/* Results pane */}
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 border-b border-border bg-background shrink-0"
        >
          <div className="relative">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH DOCUMENTS, CLAUSES, PARTIES…"
              className="w-full pl-12 pr-4 py-3 bg-muted/10 border border-border text-xs font-mono font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-0.5 border border-border">
              {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-bold text-background bg-foreground uppercase tracking-widest px-2 py-0.5 border border-foreground hover:bg-foreground/90 transition-colors"
              >
                Clear tags
              </button>
            )}
          </div>
        </motion.div>

        {/* Result list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {filtered.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="p-5 border border-border bg-background hover:bg-muted/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} weight="light" className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {result.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground shrink-0 ml-4 border border-border px-1.5 py-0.5">
                  N/A
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-mono">
                No snippet preview available yet.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-border text-muted-foreground bg-muted/20">
                  PDF
                </span>
                <span className="text-[10px] font-mono font-bold text-muted-foreground ml-auto">
                  {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-xs uppercase tracking-widest font-bold text-muted-foreground border border-dashed border-border">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
