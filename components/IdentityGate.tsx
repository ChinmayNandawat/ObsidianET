'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserIdentity } from '../types';
import { generateCoreId, saveIdentity, loadIdentity } from '../lib/identity';

interface IdentityGateProps {
  onIdentitySet: (identity: UserIdentity) => void;
  children?: React.ReactNode;
}

export const IdentityGate: React.FC<IdentityGateProps> = ({ onIdentitySet, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'return'>('new');
  const [username, setUsername] = useState('');
  const [coreId, setCoreId] = useState('');
  const [returnCoreId, setReturnCoreId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check for existing identity on mount
  useEffect(() => {
    const savedCoreId = localStorage.getItem('obsidian_identity');
    if (savedCoreId && savedCoreId.startsWith('OX-')) {
      loadIdentity(savedCoreId);
    }
    const existingIdentity = loadIdentity('');
    if (!existingIdentity) {
      setIsOpen(true);
    }
  }, []);

  const handleNewOperator = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    if (username.length > 12) {
      setError('Username must be 12 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newCoreId = generateCoreId(username);
      const newIdentity: UserIdentity = {
        coreId: newCoreId,
        username,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profile: null,
        messages: [],
        profilingComplete: false,
        recommendations: []
      };

      await saveIdentity(newIdentity);
      onIdentitySet(newIdentity);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to create identity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnOperator = async () => {
    if (!returnCoreId.trim()) {
      setError('Core ID is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const existingIdentity = await loadIdentity(returnCoreId);
      if (existingIdentity) {
        onIdentitySet(existingIdentity);
        setIsOpen(false);
      } else {
        setError('Core ID not recognized');
      }
    } catch (err) {
      setError('Failed to restore session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipAsGuest = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0a0a] border border-[#00ff41]/20 rounded-xl p-8 max-w-md w-full"
        >
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'new'
                  ? 'border-b-2 border-[#00ff41] text-[#00ff41]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              New Operator
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'return'
                  ? 'border-b-2 border-[#00ff41] text-[#00ff41]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Return Operator
            </button>
          </div>

          {/* Content */}
          {activeTab === 'new' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-bold text-lg mb-2">INITIALIZE IDENTITY</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Choose your operator handle. This is permanent.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter operator handle"
                    maxLength={12}
                    className="bg-black border border-[#00ff41]/30 text-[#00ff41] rounded px-4 py-2 w-full font-mono focus:outline-none focus:border-[#00ff41]/60"
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    Your Core ID: OX-{username.toUpperCase().slice(0, 8)}-{generateCoreId(username).split('-')[2]}
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-xs">{error}</div>
                )}

                <button
                  onClick={handleNewOperator}
                  disabled={isSubmitting || !username.trim()}
                  className="w-full bg-[#00ff41] text-black font-bold py-3 rounded-lg transition-all hover:bg-[#00ff41]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'INITIALIZING...' : 'INITIALIZE'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-bold text-lg mb-2">RESTORE SESSION</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={returnCoreId}
                    onChange={(e) => setReturnCoreId(e.target.value)}
                    placeholder="Enter your Core ID (e.g., OX-SHOURYA-4F2A)"
                    className="bg-black border border-[#00ff41]/30 text-[#00ff41] rounded px-4 py-2 w-full font-mono focus:outline-none focus:border-[#00ff41]/60"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-xs">{error}</div>
                )}

                <button
                  onClick={handleReturnOperator}
                  disabled={isSubmitting || !returnCoreId.trim()}
                  className="w-full bg-[#00ff41] text-black font-bold py-3 rounded-lg transition-all hover:bg-[#00ff41]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'RESTORING...' : 'RESTORE'}
                </button>
              </div>
            </div>
          )}

          {/* Skip Option */}
          <div className="text-center">
            <button
              onClick={handleSkipAsGuest}
              className="text-gray-600 text-xs underline hover:text-gray-500 transition-colors"
            >
              Continue as guest (session won't be saved)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
