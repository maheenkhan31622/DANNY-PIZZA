import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESTAURANT_INFO } from '../data/menuData';

interface SplashScreenProps {
  visible: boolean;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  decay: number;
}

export function SplashScreen({ visible, onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#EF4444', '#F59E0B', '#FBBF24', '#FFFFFF', '#DC2626', '#FB7185'];
    const particles: Particle[] = [];

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
        const speed = 2.2 + Math.random() * 5.8;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: 1.8 + Math.random() * 2.6,
          decay: 0.014 + Math.random() * 0.012,
        });
      }
    };

    const w = window.innerWidth;
    const h = window.innerHeight;
    spawnBurst(w * 0.5, h * 0.44, 42);
    const t1 = setTimeout(() => spawnBurst(w * 0.28, h * 0.34, 34), 260);
    const t2 = setTimeout(() => spawnBurst(w * 0.72, h * 0.34, 34), 480);
    const t3 = setTimeout(() => spawnBurst(w * 0.5, h * 0.26, 38), 760);

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.085;
        p.vx *= 0.985;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={onComplete}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0304] via-[#1C0609] to-[#080203] cursor-pointer select-none"
        >
          <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 h-full w-full"
          />

          <motion.div
            initial={{ scale: 0.25, opacity: 0, y: 24 }}
            animate={{ scale: [0.25, 1.12, 0.96, 1], opacity: 1, y: 0 }}
            transition={{ duration: 0.95, times: [0, 0.55, 0.8, 1], ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            <div className="relative mb-5">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/45 via-amber-500/30 to-red-500/45 blur-2xl" />
              <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-amber-400 to-red-700 shadow-2xl shadow-red-900/60">
                <img
                  src={RESTAURANT_INFO.logoUrl}
                  alt="DANNY PIZZA"
                  className="h-full w-full rounded-full object-cover bg-black"
                />
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
            >
              DANNY PIZZA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-1.5 text-sm sm:text-base font-medium tracking-widest uppercase text-amber-300"
            >
              Fast Food &amp; Charcoal BBQ
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 1.4, ease: 'easeInOut' }}
              className="mt-6 h-1 w-40 origin-left rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-red-500"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
