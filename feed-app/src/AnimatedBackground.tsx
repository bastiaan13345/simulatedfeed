import { motion } from 'framer-motion';

const blobs = [
  {
    color: 'rgba(10, 132, 255, 0.25)',
    size: 400,
    x: [ '20%', '60%', '30%', '20%' ],
    y: [ '30%', '50%', '70%', '30%' ],
    duration: 20,
  },
  {
    color: 'rgba(120, 80, 220, 0.2)',
    size: 350,
    x: [ '70%', '30%', '60%', '70%' ],
    y: [ '60%', '30%', '40%', '60%' ],
    duration: 25,
  },
  {
    color: 'rgba(0, 180, 160, 0.18)',
    size: 300,
    x: [ '50%', '80%', '20%', '50%' ],
    y: [ '20%', '60%', '50%', '20%' ],
    duration: 22,
  },
  {
    color: 'rgba(180, 60, 200, 0.12)',
    size: 280,
    x: [ '40%', '20%', '70%', '40%' ],
    y: [ '70%', '40%', '20%', '70%' ],
    duration: 28,
  },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: '#0a0a0f' }} />
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          animate={{ left: blob.x, top: blob.y }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
