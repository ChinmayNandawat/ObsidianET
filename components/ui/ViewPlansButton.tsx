'use client';

import { useState } from 'react';
import { PricingModal } from './PricingModal';

interface ViewPlansButtonProps {
  product: 'ET Prime' | 'ET Markets' | 'ET Wealth';
  className?: string;
}

export function ViewPlansButton({ product, className = '' }: ViewPlansButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProductInfo = () => {
    switch (product) {
      case 'ET Prime':
        return {
          name: 'ET Prime',
          tagline: 'Unlock full access to ET Prime',
          subscribeUrl: 'https://etprime.economictimes.com/plans'
        };
      case 'ET Markets':
        return {
          name: 'ET Markets',
          tagline: 'Unlock full access to ET Markets',
          subscribeUrl: 'https://markets.economictimes.indiatimes.com'
        };
      case 'ET Wealth':
        return {
          name: 'ET Wealth',
          tagline: 'Unlock full access to ET Wealth',
          subscribeUrl: 'https://economictimes.indiatimes.com/wealth/plan'
        };
    }
  };

  const productInfo = getProductInfo();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`border border-[#00ff00] text-[#00ff00] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00ff00]/10 transition-colors ${className}`}
      >
        View Plans
      </button>
      
      <PricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={productInfo}
      />
    </>
  );
}
