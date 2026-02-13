import { Skeleton } from "@/components/ui/skeleton"
import { GlassCard } from "@/components/ui/glass-card"

export function ListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-neutral-800" />
                            <Skeleton className="h-3 w-20 bg-neutral-800" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full bg-neutral-800" />
                </GlassCard>
            ))}
        </div>
    )
}

export function CardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
                <GlassCard key={i} className="h-48 p-6 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-32 bg-neutral-800" />
                        <Skeleton className="h-8 w-8 rounded-full bg-neutral-800" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-neutral-800" />
                    <div className="pt-4 space-y-2">
                        <Skeleton className="h-3 w-full bg-neutral-800" />
                        <Skeleton className="h-3 w-2/3 bg-neutral-800" />
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
