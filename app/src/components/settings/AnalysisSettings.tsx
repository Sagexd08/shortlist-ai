'use client';

import { motion } from 'framer-motion';
import { Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore, DEFAULT_WEIGHTS, DEFAULT_STRICTNESS, AnalysisWeights, StrictnessLevel } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AnalysisSettings() {
    const { weights, strictness, setWeights, setStrictness, resetDefaults } = useSettingsStore();

    const handleWeightChange = (key: keyof AnalysisWeights, value: number) => {
        setWeights({ ...weights, [key]: value });
    };

    const handleReset = () => {
        resetDefaults();
        toast.success("Settings reset to defaults");
    };

    const totalWeight = weights.semantic + weights.skills + weights.keywords;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-foreground">Analysis Logic</h3>
                    <p className="text-sm text-muted-foreground">Customize how the AI evaluates candidates</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Defaults
                </Button>
            </div>

            {/* Weights Configuration */}
            <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 text-primary mb-4">
                    <Sliders className="w-5 h-5" />
                    <h4 className="font-medium">Scoring Weights</h4>
                </div>

                <div className="space-y-6">
                    {(Object.keys(weights) as Array<keyof AnalysisWeights>).map((key) => (
                        <div key={key} className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="capitalize text-foreground font-medium">{key} Match</span>
                                <span className="text-muted-foreground">{weights[key]}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={weights[key]}
                                onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    ))}
                </div>

                <div className={cn(
                    "flex items-center gap-2 text-sm p-3 rounded-lg",
                    totalWeight === 100 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                )}>
                    <AlertCircle className="w-4 h-4" />
                    <span>Total Weight: {totalWeight}% {totalWeight !== 100 && "(Normalized automatically)"}</span>
                </div>
            </div>

            {/* Strictness Configuration */}
            <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 text-primary mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <h4 className="font-medium">Analysis Strictness</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['low', 'medium', 'high'] as StrictnessLevel[]).map((level) => (
                        <button
                            key={level}
                            onClick={() => setStrictness(level)}
                            className={cn(
                                "p-4 rounded-xl border transition-all duration-200 text-left space-y-2",
                                strictness === level
                                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                    : "bg-card border-border hover:border-primary/50"
                            )}
                        >
                            <div className="font-medium capitalize text-foreground">{level}</div>
                            <div className="text-xs text-muted-foreground">
                                {level === 'high' && "Strict matching. Requires 85%+ for shortlist."}
                                {level === 'medium' && "Balanced approach. Requires 80%+ for shortlist."}
                                {level === 'low' && "Lenient matching. Requires 70%+ for shortlist."}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
