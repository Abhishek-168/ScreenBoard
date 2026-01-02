
export default function RightBar() {
    return (
        <div className="w-[23vw] h-[30vh] m-[1vw] mt-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-5 text-white">What's New</h3>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span>See tags of other users in canvas</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span>Lock shapes in canvas</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span>Set rooms as private</span>
                </div>
            </div>
        </div>
    );
};
