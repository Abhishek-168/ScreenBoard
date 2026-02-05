"use client";

import { useState } from "react";

export default function Community() {
    const [expanded, setExpanded] = useState(true);



    return (
         <div className="hidden md:block md:w-[18vw] md:m-[2vw] md:mt-8 md:bg-slate-800/40 md:border md:border-slate-700/50 md:rounded-xl md:p-5 md:backdrop-blur-sm md:transition-all md:duration-300">
            <div className="md:flex md:items-center md:justify-between md:mb-4">
                <h3 className="md:text-base md:font-bold md:text-slate-200">Notifications</h3>
                <span className="md:text-[10px] md:font-medium md:bg-white/10 md:text-slate-400 md:px-2 md:py-0.5 md:rounded-full md:border md:border-slate-600/30">
                    No new notifications
                </span>
            </div>
            
            {/* <div className="md:space-y-3">
                {(expanded ? notifications : notifications.slice(0, 3)).map((item) => (
                    <div key={item.id} className="md:flex md:items-start md:gap-3 md:text-xs md:text-slate-400 md:group md:cursor-pointer md:hover:text-slate-300 md:transition-colors">
                        <div className={`md:w-1.5 md:h-1.5 md:mt-1 md:rounded-full md:shrink-0 md:transition-colors ${item.isNew ? 'md:bg-violet-500/70 md:group-hover:bg-violet-400' : 'md:bg-slate-700'}`}></div>
                        <span className="md:leading-relaxed">{item.content}</span>
                    </div>
                ))}
            </div> */}

            <button 
                onClick={() => setExpanded(!expanded)}
                className="md:w-full md:mt-4 md:pt-3 md:border-t md:border-slate-700/30 md:text-[10px] md:uppercase md:tracking-wider md:font-medium md:text-slate-500 md:hover:text-violet-400 md:transition-colors md:text-center"
            >
                {expanded ? "Show Less" : "View All"}
            </button>
        </div>
    )
};