import React from 'react';
import ArikServicesSection from './ArikServicesSection';
import ProcessTimelineSection from './ProcessTimelineSection';
import ProductDemo from './ProductDemo';
import HistoricoFavoritos from './HistoricoFavoritos';
import MethodologySection from './MethodologySection';
import ArikManifestoSection from './ArikManifestoSection';

interface MainLandingProps {
  onSelect: (cnpj: string) => Promise<boolean>;
  isLoading: boolean;
  refreshTrigger: number;
}

export default function MainLanding({ onSelect, isLoading, refreshTrigger }: MainLandingProps) {
  return (
    <div className="space-y-16 sm:space-y-28 animate-fade-in">
      {/* 1. Arik Services Section (Image 2: Down arrow, Partner logos strip, 3-Card Grid) */}
      <ArikServicesSection onSelectCnpj={onSelect} />

      {/* 2. Arik Process Timeline (Images 3 & 4: Central connecting line, numbered badges, alternating cards) */}
      <ProcessTimelineSection />

      {/* 3. Interactive Product Demo (Cockpit with Arik styling) */}
      <ProductDemo onSelect={onSelect} isLoading={isLoading} />

      {/* 4. Local Saved Queries & Favorites */}
      <div className="pt-2">
        <HistoricoFavoritos
          onSelect={onSelect}
          isLoading={isLoading}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* 5. Methodology & Ethics */}
      <MethodologySection />

      {/* 6. Arik Studio Manifesto & Marquee Banner (Image 5) */}
      <ArikManifestoSection />
    </div>
  );
}
