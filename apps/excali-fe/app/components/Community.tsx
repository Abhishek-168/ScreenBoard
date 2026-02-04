"use client";

import { useState } from "react";

export default function Community() {
    const [expanded, setExpanded] = useState(true);

    const notifications = [
        { id: 1, content: <span><span className="md:text-slate-200 md:font-medium">@john_doe</span> mentioned you</span>, isNew: true },
        { id: 2, content: <span><span className="md:text-slate-200 md:font-medium">3</span> join requests to <span className="md:text-slate-300">Design Room</span></span>, isNew: true },
        { id: 3, content: <span><span className="md:text-slate-200 md:font-medium">@alice_smith</span> accepted invite</span>, isNew: false },
        { id: 4, content: <span><span className="md:text-slate-200 md:font-medium">@mike_99</span> mentioned you in <span className="md:text-slate-300">Brainstorm</span></span>, isNew: true },
        { id: 5, content: <span><span className="md:text-slate-200 md:font-medium">@sarah_lee</span> joined <span className="md:text-slate-300">Project X</span></span>, isNew: false },
        { id: 6, content: <span><span className="md:text-slate-200 md:font-medium">2</span> new join requests</span>, isNew: true },
    ];

    return (
         <div className="hidden md:block md:w-[18vw] md:m-[2vw] md:mt-8 md:bg-slate-800/40 md:border md:border-slate-700/50 md:rounded-xl md:p-5 md:backdrop-blur-sm md:transition-all md:duration-300">
            <div className="md:flex md:items-center md:justify-between md:mb-4">
                <h3 className="md:text-base md:font-bold md:text-slate-200">Notifications</h3>
                <span className="md:text-[10px] md:font-medium md:bg-slate-700/50 md:text-slate-400 md:px-2 md:py-0.5 md:rounded-full md:border md:border-slate-600/30">
                    {notifications.filter(n => n.isNew).length} NEW
                </span>
            </div>
            
            <div className="md:space-y-3">
                {(expanded ? notifications : notifications.slice(0, 3)).map((item) => (
                    <div key={item.id} className="md:flex md:items-start md:gap-3 md:text-xs md:text-slate-400 md:group md:cursor-pointer md:hover:text-slate-300 md:transition-colors">
                        <div className={`md:w-1.5 md:h-1.5 md:mt-1 md:rounded-full md:shrink-0 md:transition-colors ${item.isNew ? 'md:bg-violet-500/70 md:group-hover:bg-violet-400' : 'md:bg-slate-700'}`}></div>
                        <span className="md:leading-relaxed">{item.content}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => setExpanded(!expanded)}
                className="md:w-full md:mt-4 md:pt-3 md:border-t md:border-slate-700/30 md:text-[10px] md:uppercase md:tracking-wider md:font-medium md:text-slate-500 md:hover:text-violet-400 md:transition-colors md:text-center"
            >
                {expanded ? "Show Less" : "View All"}
            </button>
        </div>
    )
};