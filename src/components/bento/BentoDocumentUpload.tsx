import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadSimple,
  X,
  CheckCircle,
  Spinner,
  CaretDown,
  CaretUp,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";

type FileStatus = "uploading" | "processing" | "complete" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: FileStatus;
  progress: number;
  type: string;
  fileObj?: File;
}

const FORMATS = ["PDF", "DOCX", "DOC", "TXT"];
const LANGUAGES = ["English", "Vietnamese", "Spanish", "French", "German", "Japanese"];

export function BentoDocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [ocrLang, setOcrLang] = useState("English");
  const [confidence, setConfidence] = useState([85]);
  const [regionDetect, setRegionDetect] = useState(true);
  const [autoClassify, setAutoClassify] = useState(true);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      status: "uploading" as FileStatus,
      progress: 0,
      type: f.name.split(".").pop()?.toUpperCase() ?? "FILE",
      fileObj: f,
    }));
    
    setFiles((prev) => [...newFiles, ...prev]);

    for (const f of newFiles) {
      try {
        if (!f.fileObj) continue;
        const formData = new FormData();
        formData.append("file", f.fileObj);
        
        setFiles((prev) => prev.map((pf) => pf.id === f.id ? { ...pf, progress: 30, status: "uploading" } : pf));
        
        const res = await fetch("/api/contracts", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        setFiles((prev) => prev.map((pf) => pf.id === f.id ? { ...pf, progress: 100, status: "complete" } : pf));
      } catch (err) {
        console.error("Upload error", err);
        setFiles((prev) => prev.map((pf) => pf.id === f.id ? { ...pf, progress: 100, status: "error" } : pf));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const statusLabel: Record<FileStatus, string> = {
    uploading: "Uploading…",
    processing: "Analysing…",
    complete: "Complete",
    error: "Error",
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="p-6 border-b border-slate-100 bg-white">
        <h1 className="text-xl font-medium ">
          Document Ingestion
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-2 font-semibold">
          Upload documents for AI-powered legal analysis and extraction
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border flex-1">
        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-200 border-b border-slate-100 bg-white hover:bg-slate-50 p-16 ${isDragActive ? 'bg-slate-50 border-slate-200 border-b-2' : ''}`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ scale: isDragActive ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center w-16 h-16 border border-slate-100 bg-white"
            >
              <UploadSimple size={32} weight={isDragActive ? "fill" : "light"} className={isDragActive ? "text-slate-900" : "text-slate-500"} />
            </motion.div>

            <div className="text-center">
              <p className="text-sm font-semibold font-medium text-slate-900">
                {isDragActive ? "Release to upload" : "Drag & drop documents"}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-2 font-bold">
                or click to browse local files
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {FORMATS.map((fmt) => (
                <span
                  key={fmt}
                  className="text-[10px]  font-bold tracking-widest px-2 py-0.5 border border-slate-100 text-slate-500 bg-white"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </motion.div>

          {/* File list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="flex-1 bg-white"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold font-medium text-slate-900">
                Ingestion Queue
              </h3>
              <span className="text-[10px]  font-bold tracking-widest px-2 py-0.5 border border-slate-100 text-slate-500">
                {files.length} FILE{files.length !== 1 ? "S" : ""}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 border border-slate-100 text-xs font-mono bg-white text-slate-900 shrink-0">
                          {file.type.slice(0, 3)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs font-mono text-slate-500 mt-0.5">
                            {file.size}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 px-2 py-1 border border-slate-100 bg-white">
                            {file.status === "complete" ? (
                              <CheckCircle size={14} weight="fill" className="text-slate-900" />
                            ) : file.status === "error" ? (
                                <X size={14} weight="bold" className="text-destructive" />
                            ) : (
                              <Spinner size={14} className="animate-spin text-slate-500" />
                            )}
                            <span className="text-[10px]  font-bold tracking-widest text-slate-900">
                              {statusLabel[file.status]}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <X size={16} weight="bold" />
                          </button>
                        </div>
                      </div>
                      {file.status !== "complete" && file.status !== "error" && (
                        <div className="mt-4">
                           <Progress value={file.progress} className="h-1 rounded-2xl border border-slate-100 bg-slate-100 [&>div]:bg-blue-600" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {files.length === 0 && (
                  <div className="p-12 text-center text-slate-500 text-xs font-medium font-bold">
                    Queue is empty
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* OCR Settings panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-4 bg-white"
        >
          <div>
            <button
              className="flex items-center justify-between w-full p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors"
              onClick={() => setOcrOpen(!ocrOpen)}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} weight="bold" />
                <span className="text-sm font-semibold font-medium text-slate-900">
                  Extraction Rules
                </span>
              </div>
              {ocrOpen ? (
                <CaretUp size={16} weight="bold" />
              ) : (
                <CaretDown size={16} weight="bold" />
              )}
            </button>

            <AnimatePresence>
              {ocrOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-b border-slate-100"
                >
                  <div className="flex flex-col gap-6 p-6">
                    {/* Language */}
                    <div>
                      <label className="text-[10px]  font-bold tracking-widest text-slate-500 mb-3 block">
                        Primary Language
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setOcrLang(lang)}
                            className={`text-xs px-3 py-1.5 border font-semibold transition-colors ${
                              ocrLang === lang
                                ? "bg-blue-600 text-white border-slate-200"
                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confidence threshold */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px]  font-bold tracking-widest text-slate-500">
                          Min. Confidence
                        </label>
                        <span className="text-xs font-mono font-bold text-slate-900">
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
                    <div className="flex flex-col gap-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Region Detection
                          </p>
                          <p className="text-[10px] font-medium font-bold text-slate-500 mt-1">
                            Auto-detect text regions
                          </p>
                        </div>
                        <Switch
                          checked={regionDetect}
                          onCheckedChange={setRegionDetect}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Auto-classify
                          </p>
                          <p className="text-[10px] font-medium font-bold text-slate-500 mt-1">
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
        </motion.div>
      </div>
    </div>
  );
}
