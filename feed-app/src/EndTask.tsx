import { Check, ExternalLink } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

export default function EndTask() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6 text-center relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-fade-scale-in mb-10">
          <Check className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.6)', strokeWidth: 1.5 }} />
        </div>

        <h1 className="text-hero mb-4 opacity-0 animate-stagger stagger-2">
          Task Complete
        </h1>

        <p className="text-base max-w-md mb-8 opacity-0 animate-stagger stagger-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Please click below to complete your survey.
        </p>

        <div className="opacity-0 animate-stagger stagger-3">
          <a
            href="https://forms.gle/EDMiRyZpxECRoe7TA"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover hover-scale inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all duration-200"
          >
            Complete Survey
            <ExternalLink className="w-4 h-4" style={{ strokeWidth: 1.5 }} />
          </a>
        </div>
      </div>
    </div>
  );
}
