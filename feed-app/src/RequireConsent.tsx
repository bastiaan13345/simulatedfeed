import { useState, useEffect } from 'react';
import InformedConsent from './InformedConsent';

const CONSENT_KEY = 'feed-consent-given';

export default function RequireConsent({ children, forceRequire = false }: { children: React.ReactNode, forceRequire?: boolean }) {
  const [consented, setConsented] = useState(!forceRequire && localStorage.getItem(CONSENT_KEY) === 'true');

  useEffect(() => {
    if (forceRequire) {
      localStorage.removeItem(CONSENT_KEY);
      setConsented(false);
    }
  }, [forceRequire]);

  if (!consented) {
    return <InformedConsent onAccepted={() => {
      localStorage.setItem(CONSENT_KEY, 'true');
      setConsented(true);
    }} />;
  }

  return <>{children}</>;
}
