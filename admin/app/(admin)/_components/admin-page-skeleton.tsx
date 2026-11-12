import { Skeleton, SkeletonCard, SkeletonTable } from "./ui/skeleton";

export function AdminPageSkeleton({ dashboard = false, cols = 6, stats = false }: {
  dashboard?: boolean;
  cols?: number;
  stats?: boolean;
}) {
  return (
    <div role="status" aria-label="Memuat halaman admin" aria-busy="true" className="space-y-6">
      <span className="sr-only">Memuat halaman, mohon tunggu...</span>
      <div aria-hidden="true" className="space-y-6">
        <Skeleton className="h-3 w-48 bg-amber-200/40" />
        <div className="glass rounded-3xl border border-white/70 p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-36 bg-amber-200/40" />
            <Skeleton className="h-8 w-2/3 max-w-sm bg-amber-200/50" />
            <Skeleton className="h-4 w-full max-w-lg bg-amber-200/40" />
          </div>
          <Skeleton className="h-10 w-36 bg-amber-200/50" />
        </div>
        {(stats || dashboard) && <div className={`grid gap-4 sm:grid-cols-2 ${dashboard ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
          {Array.from({ length: dashboard ? 4 : 3 }, (_, i) => <SkeletonCard key={i} />)}
        </div>}
        {dashboard && <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-16 bg-amber-200/30" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 bg-amber-200/30 rounded-3xl" />
            <Skeleton className="h-80 bg-amber-200/30 rounded-3xl" />
          </div>
        </>}
        <div className="glass rounded-3xl border border-white/70 overflow-hidden">
          <div className="p-5 flex flex-wrap justify-between gap-3 border-b border-white/60">
            <Skeleton className="h-10 w-full sm:w-72 bg-amber-200/40" />
            <Skeleton className="h-10 w-32 bg-amber-200/40" />
          </div>
          <SkeletonTable rows={5} cols={cols} />
          <div className="p-5 flex justify-between gap-4 border-t border-white/60">
            <Skeleton className="h-4 w-36 bg-amber-200/40" />
            <Skeleton className="h-8 w-40 bg-amber-200/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
