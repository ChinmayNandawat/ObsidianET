import { UserProfile } from '../../types';
import { Bolt, ShieldCheck } from 'lucide-react';

interface ProfilePanelProps {
  profile: UserProfile;
}

export const ProfilePanel = ({ profile }: ProfilePanelProps) => {
  const riskScore = profile.insights.find((item) => item.label === 'Risk appetite')?.score ?? 60;
  const experienceScore = profile.insights.find((item) => item.label === 'Experience')?.score ?? 60;

  return (
    <section className="flex flex-col space-y-8 pt-4 border-t border-white/5 mt-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-xl font-extrabold tracking-tight">Intelligence</h2>
            <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Gemini Persona Layer</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bolt className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface-container-low p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-primary font-bold">{profile.persona}</p>
          <h3 className="text-2xl font-headline font-black text-white mt-2">{profile.name}</h3>
          <p className="text-sm text-tertiary mt-3 leading-relaxed">{profile.summary}</p>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-white/5">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="6" />
              <circle
                className="text-primary drop-shadow-[0_0_8px_rgba(0,200,5,0.5)]"
                cx="80"
                cy="80"
                fill="transparent"
                r="70"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * profile.financialIQ) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-black font-headline text-white">{profile.financialIQ}</span>
              <span className="text-tertiary text-[8px] font-bold uppercase tracking-widest">Financial IQ</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Risk Appetite</label>
              <span className="text-primary text-xs font-bold">{profile.riskLabel}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full neon-glow" style={{ width: `${riskScore}%` }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Experience</label>
              <span className="text-secondary-container text-xs font-bold">{profile.experienceLevel}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary-container/50 to-secondary-container rounded-full" style={{ width: `${experienceScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface-container-low p-5 space-y-3">
          <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Profile intelligence</h4>
          {profile.insights.map((insight) => (
            <div key={insight.label} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2">
              <div>
                <div className="text-xs text-white">{insight.label}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-tertiary">{insight.value}</div>
              </div>
              <div className="text-sm font-bold text-primary">{insight.score}%</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface-container-low p-5">
          <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-3">Priority themes</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Core ID: {profile.coreId}</span>
        </div>
      </div>
    </section>
  );
};
