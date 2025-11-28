"use client";

interface VideoPlayerProps {
  glow?: boolean;
  white?: boolean;
}

export default function VideoPlayer({ glow = false, white = false }: VideoPlayerProps) {
  return (
    <div className={`relative ${glow ? 'p-2' : ''}`}>
      {/* Golden glow effect overlay */}
      {glow && (
        <div className={`absolute inset-0 rounded-4xl bg-linear-to-br ${white ? 'from-white/20' : 'from-amber-400/30'} ${white ? 'via-transparent' : 'via-yellow-200/10'} to-transparent 
                      blur-sm -z-10 scale-105`} />
      )}
      
      <video 
        src="./demoVid.mp4" 
        autoPlay 
        muted 
        loop 
        playsInline
        className={`border-0 rounded-4xl relative z-10 ${
          glow ? `${white ? 'shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'shadow-[0_0_40px_rgba(245,158,11,0.4)]'}` : ''
        }`}
      />
    </div>
  );
}