import type { JourneyStep } from '@/types';

interface RecommendedPathProps {
  journeyPath: JourneyStep[] | undefined;
  isPersonalized: boolean;
}

export function RecommendedPath({ journeyPath, isPersonalized }: RecommendedPathProps) {
  if (!isPersonalized || !journeyPath || journeyPath.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8 mb-6">
      <h2
        className="text-sm font-medium text-zinc-400 uppercase 
                   tracking-wider mb-4"
      >
        Recommended path for you
      </h2>
      <div className="flex flex-col gap-3">
        {journeyPath.map((step) => (
          <div
            key={step.step}
            className="flex items-start gap-4 rounded-lg 
                       border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full 
                           bg-zinc-800 border border-zinc-700 
                           text-xs text-zinc-400 flex items-center 
                           justify-center font-medium"
            >
              {step.step}
            </span>
            <div>
              <p className="text-sm text-white font-medium">{step.action}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{step.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
