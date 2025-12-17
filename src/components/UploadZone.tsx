'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';

interface UploadZoneProps {
    onUploadComplete: (fileId: string, text: string, fileName: string) => void;
    onReset: () => void;
}

export default function UploadZone({ onUploadComplete, onReset }: UploadZoneProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed. Please try again.");
            }

            const data = await res.json();
            setFileName(data.originalName);
            onUploadComplete(data.id, data.text, data.originalName);
        } catch (err) {
            setError("Failed to process file. Ensure it is a valid PDF or DOCX.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        },
        maxFiles: 1,
        multiple: false
    });

    if (fileName) {
        return (
            <div className="card flex items-center justify-between bg-surface animate-pulse-stop">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <CheckCircle size={24} color="var(--success)" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Resume Uploaded</p>
                        <p className="text-muted text-xs">{fileName}</p>
                    </div>
                </div>
                <button
                    onClick={() => { setFileName(null); onReset(); }}
                    className="btn btn-outline text-xs"
                >
                    Replace
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          flex flex-col items-center justify-center gap-4 h-64
          ${isDragActive ? 'border-primary bg-blue-50/10' : 'border-gray-300 hover:border-primary/50'}
        `}
                style={{ borderColor: isDragActive ? 'var(--primary)' : 'var(--border)' }}
            >
                <input {...getInputProps()} />
                <div className={`p-4 rounded-full bg-gray-100 ${uploading ? 'animate-pulse' : ''}`} style={{ background: 'var(--surface-highlight)' }}>
                    {uploading ? <UploadCloud size={32} className="text-primary" /> : <UploadCloud size={32} className="text-muted" />}
                </div>

                <div className="space-y-1">
                    <p className="font-medium">
                        {uploading ? "Analyzing document..." : isDragActive ? "Drop the resume here" : "Drag & drop resume, or click to browse"}
                    </p>
                    <p className="text-xs text-muted">Supports PDF, DOCX (Max 5MB)</p>
                </div>
            </div>
            {error && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2" style={{ color: 'var(--error)' }}>
                    <X size={16} />
                    {error}
                </div>
            )}
        </div>
    );
}
