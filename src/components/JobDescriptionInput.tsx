'use client';

import React from 'react';

interface JobDescriptionInputProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export default function JobDescriptionInput({ value, onChange, disabled }: JobDescriptionInputProps) {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <label className="text-sm font-semibold flex justify-between">
                Job Description
                <span className="text-xs font-normal text-muted">Paste the full JD here</span>
            </label>
            <textarea
                className="textarea w-full flex-grow min-h-[250px] resize-none p-4 text-sm leading-relaxed"
                placeholder="e.g. Senior Software Engineer. Requirements: React, Node.js, AWS..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            />
        </div>
    );
}
