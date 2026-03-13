import { cn } from '@/lib/utils'

export function AuraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-20 overflow-hidden',
        className
      )}
    >
      <div className="bg-background absolute inset-0" />

      {/* Bokeh orbs with varying opacities, sizes, and animations */}
      <div className="animate-blob bg-primary/20 absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full mix-blend-screen blur-[100px] filter" />
      <div className="animate-blob animation-delay-2000 absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[#60a5fa]/20 mix-blend-screen blur-[120px] filter" />
      <div className="animate-blob animation-delay-4000 bg-primary/15 absolute bottom-1/4 left-1/3 h-[450px] w-[450px] rounded-full mix-blend-screen blur-[110px] filter" />
      <div className="animate-blob animation-delay-6000 absolute right-1/3 -bottom-20 h-[500px] w-[500px] rounded-full bg-[#34d399]/20 mix-blend-screen blur-[130px] filter" />
    </div>
  )
}
