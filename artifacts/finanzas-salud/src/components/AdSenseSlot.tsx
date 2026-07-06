import React, { useEffect, useRef } from 'react';

// Extend Window to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseSlotProps {
  id: string;
  type: 'banner' | 'rectangle' | 'in-content';
  /**
   * The data-ad-slot value from your AdSense dashboard.
   * Leave empty to rely on Auto Ads, or paste your slot ID to show
   * a specific ad unit here.
   */
  slot?: string;
}

const AD_CLIENT = 'ca-pub-1824513245358227';

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ id, type, slot }) => {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount; guard against HMR double-fire in dev
    if (pushed.current) return;
    if (!insRef.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle may not be loaded yet in local dev — safe to ignore
    }
  }, []);

  let width: string;
  let height: string;
  switch (type) {
    case 'banner':
      width = '728px';
      height = '90px';
      break;
    case 'rectangle':
      width = '300px';
      height = '250px';
      break;
    case 'in-content':
      width = '100%';
      height = '200px';
      break;
  }

  return (
    <div id={id} className="adsense-slot my-8 flex justify-center w-full" data-testid={`adsense-${id}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width, height }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot ?? ''}          // fill in your AdSense slot ID
        data-ad-format={type === 'banner' ? 'horizontal' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
};
