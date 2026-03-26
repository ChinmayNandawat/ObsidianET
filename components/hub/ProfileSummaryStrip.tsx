import type { ProfileSummary } from '@/types';

interface ProfileSummaryStripProps {
  profileSummary: ProfileSummary | undefined;
  isPersonalized: boolean;
}

export function ProfileSummaryStrip({ profileSummary, isPersonalized }: ProfileSummaryStripProps) {
  if (!isPersonalized || !profileSummary) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 mb-6">
      <div className="rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-4">
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Your investor profile
            </p>
            <p className="text-white font-medium">{profileSummary.persona}</p>
          </div>
          <div className="h-px w-full bg-zinc-700/50 sm:h-8 sm:w-px sm:bg-zinc-700" />
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Primary goal</p>
            <p className="text-sm text-zinc-300">{profileSummary.primaryGoal}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Style</p>
            <p className="text-sm text-zinc-300">{profileSummary.style}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Best ET fit</p>
            <p className="text-sm text-zinc-300">
              {profileSummary.bestETFit.join(' + ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
