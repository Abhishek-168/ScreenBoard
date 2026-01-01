export default function Loader({title}: {title?: string}) {
  return (
    <>
      <section className="mt-10 flex flex-col">
        <h3 className="text-2xl font-bold mb-4">{title || "Searching..."}</h3>
        <div className="flex flex-row gap-6 overflow-x-hidden pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[340px] max-w-[340px] shrink-0 relative overflow-hidden"
            >
              <div className="relative bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 shadow-2xl animate-pulse">
                {/* Header skeleton */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <div className="h-8 bg-slate-700/50 rounded-lg w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-700/30 rounded w-24"></div>
                  </div>
                  <div className="h-7 w-16 bg-slate-700/50 rounded-full"></div>
                </div>

                {/* Stats skeleton */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-1 bg-slate-800/60 rounded-xl p-3 border border-slate-700/40 backdrop-blur-sm">
                    <div className="h-3 bg-slate-700/50 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-16"></div>
                  </div>
                  <div className="flex-1 bg-slate-800/60 rounded-xl p-3 border border-slate-700/40 backdrop-blur-sm">
                    <div className="h-3 bg-slate-700/50 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-14"></div>
                  </div>
                </div>

                {/* Button skeleton */}
                <div className="h-14 bg-slate-700/50 rounded-xl w-full"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
