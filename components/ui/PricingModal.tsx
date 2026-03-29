'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    tagline: string;
    subscribeUrl: string;
  };
}

export function PricingModal({ isOpen, onClose, product }: PricingModalProps) {
  if (!isOpen) return null;

  const handleSubscribe = () => {
    window.open(product.subscribeUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-[#0b0e14] border border-white/10 rounded-2xl p-6 max-w-[480px] w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
            <p className="text-[#9ca3af] text-sm">Unlock full access to {product.name}</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Monthly */}
            <div className="bg-[#1a1f2e] border border-white/10 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Monthly</h3>
              <div className="text-2xl font-bold text-white mb-1">₹299</div>
              <div className="text-[#9ca3af] text-sm">/month</div>
            </div>

            {/* Quarterly */}
            <div className="bg-[#1a1f2e] border border-white/10 rounded-lg p-4 text-center relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#00ff00] text-black text-xs px-2 py-1 rounded font-bold">
                Save 11%
              </div>
              <h3 className="text-white font-semibold mb-2 mt-2">Quarterly</h3>
              <div className="text-2xl font-bold text-white mb-1">₹799</div>
              <div className="text-[#9ca3af] text-sm">/quarter</div>
            </div>

            {/* Annual */}
            <div className="bg-[#1a1f2e] border-2 border-[#00ff00] rounded-lg p-4 text-center relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#00ff00] text-black text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                Best Value ⭐
              </div>
              <h3 className="text-white font-semibold mb-2 mt-2">Annual</h3>
              <div className="text-2xl font-bold text-white mb-1">₹2,499</div>
              <div className="text-[#9ca3af] text-sm">/year</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={handleSubscribe}
              className="flex-1 bg-[#00ff00] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00cc00] transition-colors"
            >
              Subscribe Now
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-[#6b7280] text-xs">
              You'll be redirected to Economic Times secure payment page
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
