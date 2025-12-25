'use client';

import { useState } from 'react';
import { Plus, Trash2, Tag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Core Technical', 'Tools & Frameworks', 'Soft Skills', 'Other'];

export function CustomSkillsSettings() {
    const { customSkills, addCustomSkill, removeCustomSkill } = useSettingsStore();
    const [newSkill, setNewSkill] = useState('');
    const [category, setCategory] = useState('Tools & Frameworks');

    const handleAdd = () => {
        if (!newSkill.trim()) return;
        if (customSkills.some(s => s.name.toLowerCase() === newSkill.toLowerCase().trim())) {
            toast.error("Skill already exists in custom dictionary");
            return;
        }

        addCustomSkill({ name: newSkill.trim(), category });
        setNewSkill('');
        toast.success(`Learned new skill: ${newSkill}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-foreground">Training & Knowledge</h3>
                    <p className="text-sm text-muted-foreground">Teach the AI new skills or domain-specific terms.</p>
                </div>
            </div>

            <div className="glass-card p-6 space-y-6">
                <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Skill Name</label>
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="e.g. LangChain, tRPC, Bun..."
                            className="w-full bg-background border border-input px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                    </div>
                    <div className="w-48 space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-background border border-input px-3 py-2 rounded-lg"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleAdd} disabled={!newSkill.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Train
                    </Button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Custom Dictionary ({customSkills.length})
                    </h4>

                    {customSkills.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border">
                            <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p>No custom skills added yet.</p>
                            <p className="text-xs">Add skills above to improve extraction accuracy.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <AnimatePresence mode="popLayout">
                                {customSkills.map((skill) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border group"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{skill.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{skill.category}</p>
                                        </div>
                                        <button
                                            onClick={() => removeCustomSkill(skill.name)}
                                            className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
