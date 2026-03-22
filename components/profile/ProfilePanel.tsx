import { UserProfile } from '../../types';
import { Bolt, ShieldCheck } from 'lucide-react';

interface ProfilePanelProps {
  profile: UserProfile;
}

export const ProfilePanel = ({ profile }: ProfilePanelProps) => {
  return (
    <section className="flex flex-col space-y-8 pt-4 border-t border-white/5 mt-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-xl font-extrabold tracking-tight">Intelligence</h2>
            <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Heuristic Vector Mapping</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bolt className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Central Radial Dial */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-white/5">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                className="text-white/5" 
                cx="80" cy="80" fill="transparent" r="70" 
                stroke="currentColor" strokeWidth="6"
              />
              <circle 
                className="text-primary drop-shadow-[0_0_8px_rgba(0,200,5,0.5)]" 
                cx="80" cy="80" fill="transparent" r="70" 
                stroke="currentColor" strokeWidth="6"
                strokeDasharray="440"
                strokeDashoffset="66"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-black font-headline text-white">85</span>
              <span className="text-tertiary text-[8px] font-bold uppercase tracking-widest">Financial IQ</span>
            </div>
          </div>
        </div>

        {/* Fluid Progress Bars */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Risk Appetite</label>
              <span className="text-primary text-xs font-bold">Aggressive</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-gradient-to-r from-primary/50 to-primary rounded-full neon-glow"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Experience</label>
              <span className="text-secondary-container text-xs font-bold">Institutional</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-gradient-to-r from-secondary-container/50 to-secondary-container rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Goals Distribution */}
        <div className="pt-4">
          <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-6">Distribution Map</h4>
          <div className="flex items-center justify-center relative h-32">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border border-white/10 rounded-full rotate-45"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full rotate-45"></div>
              <svg className="absolute inset-0 w-full h-full text-secondary-container/30 fill-secondary-container/10">
                <polygon points="48,10 85,30 75,80 20,70 10,40" stroke="currentColor" strokeWidth="1.5"></polygon>
              </svg>
            </div>
            <div className="absolute top-0 text-[8px] font-bold text-tertiary">GROWTH</div>
            <div className="absolute bottom-0 text-[8px] font-bold text-tertiary">HEDGE</div>
          </div>
        </div>
      </div>

      {/* Verification Footer */}
      <div className="mt-auto pt-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Core ID: OX-992-FLUX</span>
        </div>
      </div>
    </section>
  );
};
