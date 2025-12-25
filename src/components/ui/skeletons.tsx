'use client';

import { motion } from 'framer-motion';
import { Skeleton } from './skeleton';

/**
 * Card skeleton for dashboard/results
 */
export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>
        </div>
    );
}

/**
 * Role recommendation card skeleton
 */
export function RoleCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl border border-white/10 bg-white/5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
            </div>
        </motion.div>
    );
}

/**
 * Interview session loading skeleton
 */
export function InterviewSkeleton() {
    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 p-8">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                {/* Avatar skeleton */}
                <Skeleton className="h-40 w-40 rounded-full" />

                {/* Text skeleton */}
                <div className="space-y-4 text-center w-full max-w-lg">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>

                {/* Button skeleton */}
                <Skeleton className="h-12 w-40 rounded-full" />
            </div>
        </div>
    );
}

/**
 * Analysis results skeleton
 */
export function AnalysisSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-16 w-16 rounded-full" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Profile/LinkedIn card skeleton
 */
export function ProfileSkeleton() {
    return (
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}
