import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings2,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

type FileStatus = "uploading" | "processing" | "complete" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: FileStatus;
  progress: number;
  type: string;
}

const mockFiles: UploadedFile[] = [
  { id: "1", name: "ContractDraft_V4_Final.pdf", size: "2.4 MB", status: "complete", progress: 100, type: "PDF" },
  { id: "2", name: "MergerTermSheet_Confidential.pdf", size: "1.1 MB", status: "processing", progress: 67, type: "PDF" },
  { id: "3", name: "EmploymentHandbook_2026.docx", size: "3.8 MB", status: "uploading", progress: 34, type: "DOCX" },
];

const FORMATS = ["PDF", "DOCX", "DOC", "TXT", "RTF", "TIFF", "PNG", "JPG"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Japanese"];

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [ocrLang, setOcrLang] = useState("English");
  const [confidence, setConfidence] = useState([85]);
  const [regionDetect, setRegionDetect] = useState(true);
  const [autoClassify, setAutoClassify] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      status: "uploading" as FileStatus,
      progress: 0,
      type: f.name.split(".").pop()?.toUpperCase() ?? "FILE",
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const statusColor: Record<FileStatus, string> = {
    uploading: "#A78BFA",
    processing: "#06B6D4",
    complete: "#10B981",
    error: "#EF4444",
  };

  const statusLabel: Record<FileStatus, string> = {
    uploading: "Uploading…",
    processing: "Analysing…",
    complete: "Complete",
    error: "Error",
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold" style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}>
          Document Ingestion
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>
          Upload documents for AI-powered legal analysis and OCR extraction
        </p>
      </motion.div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200"
            style={{
              ...GLASS,
              padding: "48px 32px",
              border: isDragging
                ? "1px solid rgba(124,58,237,0.6)"
                : "1px dashed rgba(255,255,255,0.12)",
              background: isDragging ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)",
              boxShadow: isDragging ? "0 0 40px rgba(124,58,237,0.15)" : "none",
            }}
          >
            <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.docx,.doc,.txt" />
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 64,
                height: 64,
                background: isDragging
                  ? "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.3))"
                  : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Upload size={28} style={{ color: isDragging ? "#A78BFA" : "#64748B" }} />
            </motion.div>

            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: isDragging ? "#A78BFA" : "#F1F5F9" }}>
                {isDragging ? "Release to upload" : "Drag & drop documents here"}
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                or click to browse files
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {FORMATS.map((fmt) => (
                <span
                  key={fmt}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8" }}
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </motion.div>

          {/* File list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="p-5"
            style={GLASS}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                Upload Queue
              </h3>
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-2 p-3 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded shrink-0 text-xs font-semibold"
                        style={{
                          width: 32,
                          height: 32,
                          background: "rgba(124,58,237,0.15)",
                          color: "#A78BFA",
                          border: "1px solid rgba(124,58,237,0.2)",
                        }}
                      >
                        {file.type.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "#F1F5F9" }}>
                          {file.name}
                        </p>
                        <p className="text-xs" style={{ color: "#475569" }}>
                          {file.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {file.status === "complete" ? (
                          <CheckCircle size={14} style={{ color: "#10B981" }} />
                        ) : (
                          <Loader2
                            size={14}
                            style={{ color: statusColor[file.status] }}
                            className="animate-spin"
                          />
                        )}
                        <span className="text-xs" style={{ color: statusColor[file.status] }}>
                          {statusLabel[file.status]}
                        </span>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="rounded p-0.5 transition-colors hover:bg-white/10"
                        >
                          <X size={12} style={{ color: "#475569" }} />
                        </button>
                      </div>
                    </div>
                    {file.status !== "complete" && (
                      <Progress
                        value={file.progress}
                        className="h-1"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* OCR Settings panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="p-5" style={GLASS}>
            <button
              className="flex items-center justify-between w-full cursor-pointer"
              onClick={() => setOcrOpen(!ocrOpen)}
            >
              <div className="flex items-center gap-2">
                <Settings2 size={15} style={{ color: "#A78BFA" }} />
                <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                  OCR Settings
                </span>
              </div>
              {ocrOpen ? (
                <ChevronUp size={14} style={{ color: "#64748B" }} />
              ) : (
                <ChevronDown size={14} style={{ color: "#64748B" }} />
              )}
            </button>

            <AnimatePresence>
              {ocrOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-5 mt-5">
                    {/* Language */}
                    <div>
                      <label className="text-xs uppercase tracking-wider block mb-2" style={{ color: "#64748B" }}>
                        Language
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {LANGUAGES.slice(0, 5).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setOcrLang(lang)}
                            className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
                            style={
                              ocrLang === lang
                                ? {
                                    background: "rgba(124,58,237,0.25)",
                                    color: "#A78BFA",
                                    border: "1px solid rgba(124,58,237,0.4)",
                                  }
                                : {
                                    background: "rgba(255,255,255,0.05)",
                                    color: "#94A3B8",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }
                            }
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confidence threshold */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs uppercase tracking-wider" style={{ color: "#64748B" }}>
                          Min. Confidence
                        </label>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: "#A78BFA" }}>
                          {confidence[0]}%
                        </span>
                      </div>
                      <Slider
                        value={confidence}
                        onValueChange={setConfidence}
                        min={50}
                        max={99}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "#CBD5E1" }}>
                            Region Detection
                          </p>
                          <p className="text-xs" style={{ color: "#475569" }}>
                            Auto-detect text regions
                          </p>
                        </div>
                        <Switch
                          checked={regionDetect}
                          onCheckedChange={setRegionDetect}
                        />
                      </div>
                      <div
                        style={{ height: 1, background: "rgba(255,255,255,0.06)" }}
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "#CBD5E1" }}>
                            Auto-classify
                          </p>
                          <p className="text-xs" style={{ color: "#475569" }}>
                            Tag document type on upload
                          </p>
                        </div>
                        <Switch
                          checked={autoClassify}
                          onCheckedChange={setAutoClassify}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Capacity info */}
          <div className="p-5" style={GLASS}>
            <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>
              Storage
            </h3>
            <p className="text-2xl font-semibold tabular-nums" style={{ color: "#F1F5F9" }}>
              12.4 GB
            </p>
            <p className="text-xs mt-1 mb-3" style={{ color: "#64748B" }}>
              of 50 GB used
            </p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: "24.8%", background: "linear-gradient(90deg, #7C3AED, #4F46E5)" }}
              />
            </div>
          </div>

          {/* Upload button */}
          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              boxShadow: "0 0 24px rgba(124,58,237,0.3)",
            }}
          >
            <FileText size={15} />
            Process All Documents
          </button>
        </motion.div>
      </div>
    </div>
  );
}
