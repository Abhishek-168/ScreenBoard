
export default function RightBar() {
    return (
        <div className="hidden md:block md:w-[18vw] md:m-[2vw] md:mt-8 md:bg-slate-800/40 md:border md:border-slate-700/50 md:rounded-xl md:p-5 md:backdrop-blur-sm">
            <h3 className="md:text-base md:font-bold md:mb-4 md:text-white/70">What's New</h3>
            
            <div className="md:space-y-3">
                <div className="md:flex md:items-center md:gap-3 md:text-sm md:text-slate-400">
                    <div className="md:w-1.5 md:h-1.5 md:rounded-full md:bg-blue-400/60 md:shrink-0"></div>
                    <span>See tags of other users in canvas</span>
                </div>
                <div className="md:flex md:items-center md:gap-3 md:text-sm md:text-slate-400">
                    <div className="md:w-1.5 md:h-1.5 md:rounded-full md:bg-blue-400/60 md:shrink-0"></div>
                    <span>Lock shapes in canvas</span>
                </div>
                <div className="md:flex md:items-center md:gap-3 md:text-sm md:text-slate-400">
                    <div className="md:w-1.5 md:h-1.5 md:rounded-full md:bg-blue-400/60 md:shrink-0"></div>
                    <span>Set rooms as private</span>
                </div>
            </div>
        </div>
    );
};
