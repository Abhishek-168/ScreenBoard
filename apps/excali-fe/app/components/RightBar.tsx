
export default function RightBar() {
    return (
        <div className="w-[18vw] m-[2vw] mt-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="text-base font-bold mb-4 text-white/70">What's New</h3>
            
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0"></div>
                    <span>See tags of other users in canvas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0"></div>
                    <span>Lock shapes in canvas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0"></div>
                    <span>Set rooms as private</span>
                </div>
            </div>
        </div>
    );
};
