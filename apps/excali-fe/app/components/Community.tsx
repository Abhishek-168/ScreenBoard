"use client";

import { useState } from "react";

export default function Community() {
    const [expanded, setExpanded] = useState(false);

    const notifications = [
        { id: 1, content: <span><span className="text-slate-200 font-medium">@john_doe</span> mentioned you</span>, isNew: true },
        { id: 2, content: <span><span className="text-slate-200 font-medium">3</span> join requests to <span className="text-slate-300">Design Room</span></span>, isNew: true },
        { id: 3, content: <span><span className="text-slate-200 font-medium">@alice_smith</span> accepted invite</span>, isNew: false },
        { id: 4, content: <span><span className="text-slate-200 font-medium">@mike_99</span> mentioned you in <span className="text-slate-300">Brainstorm</span></span>, isNew: true },
        { id: 5, content: <span><span className="text-slate-200 font-medium">@sarah_lee</span> joined <span className="text-slate-300">Project X</span></span>, isNew: false },
        { id: 6, content: <span><span className="text-slate-200 font-medium">2</span> new join requests</span>, isNew: true },
    ];

    return (
         <div className="w-[18vw] m-[2vw] mt-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-200">Notifications</h3>
                <span className="text-[10px] font-medium bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full border border-slate-600/30">
                    {notifications.filter(n => n.isNew).length} NEW
                </span>
            </div>
            
            <div className="space-y-3">
                {(expanded ? notifications : notifications.slice(0, 3)).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 text-xs text-slate-400 group cursor-pointer hover:text-slate-300 transition-colors">
                        <div className={`w-1.5 h-1.5 mt-1 rounded-full shrink-0 transition-colors ${item.isNew ? 'bg-violet-500/70 group-hover:bg-violet-400' : 'bg-slate-700'}`}></div>
                        <span className="leading-relaxed">{item.content}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full mt-4 pt-3 border-t border-slate-700/30 text-[10px] uppercase tracking-wider font-medium text-slate-500 hover:text-violet-400 transition-colors text-center"
            >
                {expanded ? "Show Less" : "View All"}
            </button>
        </div>
    )
};