export default function Loader({title}: {title?: string}) {
  return (
    <>
      <section className="mt-10 flex flex-col">
        <h3 className="text-2xl font-bold mb-5">{title || "Searching..."}</h3>
        <div className="flex flex-row gap-6 overflow-x-hidden pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[340px] max-w-[340px] shrink-0 relative overflow-hidden"
            >
              <div className="relative rounded-2xl p-5 bg-slate-800/40 border border-white/5 animate-pulse">
                {/* Header skeleton */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="h-7 bg-white/10 rounded-lg w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/5 rounded w-24"></div>
                  </div>
                  <div className="h-5 w-16 bg-white/10 rounded"></div>
                </div>

                {/* Stats skeleton */}
                <div className="flex gap-6 mb-6">
                  <div>
                    <div className="h-3 bg-white/10 rounded w-16 mb-2"></div>
                    <div className="h-5 bg-white/10 rounded w-20"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-white/10 rounded w-12 mb-2"></div>
                    <div className="h-5 bg-white/10 rounded w-16"></div>
                  </div>
                </div>

                {/* Button skeleton */}
                <div className="h-10 bg-white/5 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
