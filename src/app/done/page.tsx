"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DonePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      shape: "circle" | "ribbon";
    }> = [];

    const colors = ["#E8C87A", "#F5E6B8", "#C9A227", "#6B1E2A"];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(Math.random() * 2 + 0.8),
        size: Math.random() * 5 + 2,
        alpha: Math.random() * 0.65 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        shape: Math.random() > 0.45 ? "ribbon" : "circle",
      });
    }

    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.0025;
        if (p.y < -20 || p.alpha <= 0) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.alpha = 0.7;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (p.shape === "ribbon") {
          ctx.fillRect(-p.size, -p.size / 2, p.size * 2.2, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <main className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0, rotate: -18 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
          className="relative w-20 h-20 rounded-full flex items-center justify-center mb-8"
          style={{
            background: "rgba(247,240,230,0.96)",
            border: "1px solid rgba(232,200,122,0.3)",
            boxShadow: "0 0 48px rgba(232,200,122,0.18)",
          }}
        >
          <Image src="/itl-logo.png" alt="ITL" width={52} height={52} className="object-contain" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.65 }}
            className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "#E8C87A", color: "#120A06" }}
          >
            ✓
          </motion.span>
        </motion.div>

        <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-champagne/55 mb-3">
          Votes submitted
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl font-semibold italic text-champagne mb-4"
          style={{ textShadow: "0 0 40px rgba(232,200,122,0.25)" }}
        >
          Your vote is in!
        </h1>
        <div className="gold-rule w-36 mx-auto mb-5" />
        <p className="font-body text-ivory/60 mb-1">Your votes are recorded for</p>
        <p className="font-display text-2xl font-semibold italic text-champagne mb-1">
          Cena a la Lus
        </p>
        <p className="font-body text-sm text-ivory/40 mb-8">Dinner and Awards Night</p>

        <p className="font-body text-sm text-ivory/45 leading-relaxed mb-10 max-w-xs">
          Thank you for making your voice count. A confirmation has been sent
          to your phone — we&apos;ll see you at the table.
        </p>

        <Link href="/">
          <button className="btn-outline">← Back to home</button>
        </Link>
      </motion.div>
    </main>
  );
}
