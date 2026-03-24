'use client';

import { useState, useEffect } from 'react';
import { UserIdentity } from '../types';
import { loadIdentity } from '../lib/identity';

interface IdentityBadgeProps {
  className?: string;
}

export const IdentityBadge = ({ className = '' }: IdentityBadgeProps) => {
  const [identity, setIdentity] = useState<UserIdentity | null>(null);

  useEffect(() => {
    loadIdentity('').then(setIdentity);
  }, []);

  if (!identity) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
        <span className="font-mono text-xs text-yellow-500/70">GUEST MODE</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]"></div>
      <div className="relative">
        <span className="font-mono text-xs text-[#00ff41]/70">
          {identity.coreId}
        </span>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
          <div className="font-bold">{identity.username}</div>
          <div className="text-gray-400">Active Session</div>
        </div>
      </div>
    </div>
  );
};
