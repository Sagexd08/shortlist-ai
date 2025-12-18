'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Settings,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed inset-y-0 h-full">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">
            <span className="gradient-text">Shortlist</span>
            <span className="text-muted-foreground">.ai</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-0.5 h-6 bg-primary rounded-full ml-1"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3 h-3" />
              <span>Enterprise Mode</span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Data persists across sessions.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-64">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
}
