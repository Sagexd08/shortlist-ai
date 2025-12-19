'use client';

import { useState } from 'react';
import { Trash2, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysisStore } from '@/store/analysisStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function DataSettings() {
    const { history, clearHistory } = useAnalysisStore();
    const [confirmClear, setConfirmClear] = useState(false);

    const handleClear = () => {
        clearHistory();
        setConfirmClear(false);
        toast.success("History cleared successfully");
    };

    const handleExport = async () => {
        try {
            // Use Blob to handle large data without freezing UI with huge base64 strings
            const jsonString = JSON.stringify(history, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.href = url;
            downloadAnchorNode.download = `shortlist_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();

            // Cleanup
            document.body.removeChild(downloadAnchorNode);
            URL.revokeObjectURL(url);

            toast.success(`Successfully exported ${history.length} records`);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export data");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground">Data Management</h3>

            <div className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-foreground">Export Data</h4>
                        <p className="text-sm text-muted-foreground">Download your analysis history as JSON</p>
                    </div>
                    <Button variant="outline" onClick={handleExport} disabled={history.length === 0}>
                        <Download className="w-4 h-4 mr-2" />
                        Export ({history.length})
                    </Button>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-destructive">Danger Zone</h4>
                        <p className="text-sm text-muted-foreground">Irreversible actions for your data</p>
                    </div>

                    {!confirmClear ? (
                        <Button
                            variant="destructive"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                            onClick={() => setConfirmClear(true)}
                            disabled={history.length === 0}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All History
                        </Button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-3"
                        >
                            <div className="flex items-center gap-2 text-destructive font-medium">
                                <AlertTriangle className="w-5 h-5" />
                                Are you absolutely sure?
                            </div>
                            <p className="text-sm text-muted-foreground">
                                This action cannot be undone. This will permanently delete your {history.length} analysis records from local storage.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="destructive" size="sm" onClick={handleClear}>
                                    Yes, delete everything
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
