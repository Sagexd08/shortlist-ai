import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeUploadProps {
  onFileSelect: (file: File, text: string) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function ResumeUpload({ onFileSelect, selectedFile, onClear }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please upload a PDF or DOCX file';
    }
    if (file.size > maxSize) {
      return 'File size must be under 5MB';
    }
    return null;
  };

  const processFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsDragging(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Mock upload delay for effect - in real app this would upload to S3/API
      // For now we assume the API route exists as per previous context
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to upload/parse file');
      }

      onFileSelect(file, data.text);

    } catch (err) {
      console.error(err);
      setError("Failed to process resume. Please ensure it is a valid PDF/DOCX.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          Resume Upload
        </label>
        {selectedFile && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
            Ready for Analysis
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 p-4 transition-colors hover:border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • PDF Parsed
                  </p>
                </div>
              </div>
              <button
                onClick={onClear}
                className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "group relative flex flex-col items-center justify-center w-full h-48 rounded-xl border border-dashed cursor-pointer transition-all duration-300 overflow-hidden",
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50",
                error && "border-red-500/50 bg-red-500/5"
              )}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />

              {/* Background Glow Animation */}
              {!isDragging && !error && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
                </div>
              )}

              <motion.div
                animate={{
                  y: isDragging ? -4 : 0,
                  scale: isDragging ? 1.05 : 1
                }}
                className="relative z-10 flex flex-col items-center gap-4"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl",
                  isDragging
                    ? "bg-indigo-500 text-white shadow-indigo-500/25"
                    : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200"
                )}>
                  {isDragging ? (
                    <Sparkles className="w-8 h-8 animate-spin-slow" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="text-base font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {isDragging ? "Drop to analyze" : "Click to upload resume"}
                  </p>
                  <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    or drag and drop PDF/DOCX (max 5MB)
                  </p>
                </div>
              </motion.div>
            </label>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-3 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
