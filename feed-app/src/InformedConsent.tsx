import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface InformedConsentProps {
  onAccepted: () => void;
}

export default function InformedConsent({ onAccepted }: InformedConsentProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 relative animate-fade-scale-in"
        style={{
          background: 'rgba(28, 28, 30, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.15)' }} />

        <h2
          className="text-center mb-2"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          Informed Consent
        </h2>

        <div
          className="w-12 h-px mx-auto mb-6"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />

        <p className="mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>
          Before proceeding, please read and acknowledge the informed consent information for this research study.
          You may review the full details in a separate tab.
        </p>

        <a
          href="https://rug.eu.qualtrics.com/jfe/form/SV_bjSUPoFGhXSdan4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl mb-6 transition-all duration-200"
          style={{
            background: 'rgba(10, 132, 255, 0.15)',
            border: '1px solid rgba(10, 132, 255, 0.3)',
            color: '#6BB3FF',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Read Full Consent Form
          <ExternalLink className="w-4 h-4" style={{ strokeWidth: 1.5 }} />
        </a>

        <label className="flex items-start gap-3 mb-8 cursor-pointer group">
          <div
            className="shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
            style={{
              background: checked ? 'rgba(10, 132, 255, 0.9)' : 'rgba(255,255,255,0.08)',
              border: checked ? 'none' : '1px solid rgba(255,255,255,0.2)',
            }}
            onClick={() => setChecked(!checked)}
          >
            {checked && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.5 }}>
            I have read the informed consent information and I agree to participate in this study.
          </span>
        </label>

        <button
          onClick={onAccepted}
          disabled={!checked}
          className="w-full py-3.5 px-5 rounded-2xl font-medium transition-all duration-200"
          style={{
            background: checked ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
            color: checked ? '#000' : 'rgba(255,255,255,0.25)',
            cursor: checked ? 'pointer' : 'not-allowed',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Continue to Study
        </button>

        <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.04em' }}>
          Participation is voluntary — you may withdraw at any time
        </p>
      </div>
    </div>
  );
}