import { cn } from "@/lib/utils"

export function DataVisualizationPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute w-full h-full opacity-5", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* データポイントをシミュレートする円 */}
        <circle cx="20%" cy="30%" r="2" fill="currentColor" />
        <circle cx="40%" cy="50%" r="2" fill="currentColor" />
        <circle cx="60%" cy="20%" r="2" fill="currentColor" />
        <circle cx="80%" cy="70%" r="2" fill="currentColor" />
        <circle cx="30%" cy="80%" r="2" fill="currentColor" />
        
        {/* データラインをシミュレート */}
        <path d="M 20% 30% L 40% 50% L 60% 20% L 80% 70% L 30% 80%" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeDasharray="5,5" />
      </svg>
    </div>
  )
} 