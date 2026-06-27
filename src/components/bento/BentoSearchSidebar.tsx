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
import { Slider } from "../ui/slider";

interface Contract {
  id: string;
  title: string;
  created_at: string;
}

export function BentoSearchSidebar() {
  const [query, setQuery] = useState("");
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


  const filtered = contracts.filter((r) => {
    const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="flex h-full overflow-hidden bg-white text-slate-900">
      {/* Filter sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-6 p-6 overflow-y-auto shrink-0 border-r border-slate-100 bg-slate-50"
        style={{ width: 280 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} weight="bold" />
            <span className="text-sm font-semibold font-medium">
              Filters
            </span>
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="text-slate-500 hover:text-slate-900 transition-colors">
            {filtersOpen ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
          </button>
        </div>

        {filtersOpen && (
          <div className="flex flex-col gap-6">


            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-500 font-medium">
                  Min. AI Confidence
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
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
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 border-b border-slate-100 bg-white shrink-0"
        >
          <div className="relative">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH DOCUMENTS, CLAUSES, PARTIES…"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-200 focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-bold text-slate-500 font-medium px-2 py-0.5 border border-slate-100">
              {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-bold text-white bg-blue-600 font-medium px-2 py-0.5 border border-slate-200 hover:bg-blue-600/90 transition-colors"
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
              className="p-5 border border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} weight="light" className="text-slate-500 group-hover:text-slate-900 transition-colors shrink-0" />
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {result.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 ml-4 border border-slate-100 px-1.5 py-0.5">
                  N/A
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4 font-mono">
                No snippet preview available yet.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px]  font-bold tracking-widest px-2 py-0.5 border border-slate-100 text-slate-500 bg-slate-50">
                  PDF
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 ml-auto">
                  {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-xs font-medium font-bold text-slate-500 border border-dashed border-slate-100">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
