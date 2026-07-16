"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import VotingCountdown from "@/components/VotingCountdown";
import { isVotingOpen } from "@/lib/votingDeadline";

export default function HomePage() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(isVotingOpen());
    const id = setInterval(() => setOpen(isVotingOpen()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative">
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(232,200,122,0.1) 0%, transparent 60%), linear-gradient(180deg, transparent 55%, #120a06 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[28%] left-1/2 -translate-x-1/2 w-[min(90vw,28rem)] h-[min(90vw,28rem)] rounded-full float-glow"
          style={{
            background: "radial-gradient(circle, rgba(232,200,122,0.16) 0%, transparent 68%)",
            filter: "blur(8px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-8"
          >
            <div
              className="mb-5 flex items-center justify-center rounded-full p-3"
              style={{
                background: "rgba(247,240,230,0.96)",
                boxShadow: "0 0 40px rgba(232,200,122,0.25)",
              }}
            >
              <Image
                src="/itl-logo.png"
                alt="Invitation to Light"
                width={64}
                height={64}
                priority
                className="object-contain"
              />
            </div>
            <p className="font-body text-[0.7rem] sm:text-xs uppercase tracking-[0.42em] text-champagne/70">
              Invitation to Light
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.25rem,12vw,6.5rem)] leading-[0.92] font-semibold italic text-champagne"
            style={{ textShadow: "0 0 60px rgba(232,200,122,0.25)" }}
          >
            Cena a la Lus
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md font-body text-base sm:text-lg font-light text-ivory-muted leading-relaxed"
          >
            An evening of light, dinner, and celebration — cast your vote for the awards night.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-full flex justify-center"
          >
            <VotingCountdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            {open ? (
              <Link href="/verify">
                <button className="btn-gold">Cast your vote</button>
              </Link>
            ) : (
              <button className="btn-gold" disabled>
                Voting closed
              </button>
            )}
            <a
              href="#categories"
              className="font-body text-xs tracking-widest uppercase text-ivory/35 hover:text-champagne/70 transition-colors"
            >
              View categories ↓
            </a>
          </motion.div>
        </div>
      </section>

      <section id="categories" className="relative px-6 pb-24 pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-champagne/50 mb-3">
              Night of High Class Table
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold italic text-ivory">
              {categories.length} Award Categories
            </h2>
            <div className="gold-rule mx-auto mt-6 max-w-[12rem]" />
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                className="flex items-baseline gap-3 py-3.5 border-b border-champagne/10"
              >
                <span className="font-display text-sm text-champagne/40 tabular-nums w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-body text-[0.95rem] text-ivory/75 leading-snug">
                  {cat.title}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col items-center gap-3">
            {open ? (
              <>
                <Link href="/verify">
                  <button className="btn-gold">Cast your vote</button>
                </Link>
                <p className="font-body text-xs text-ivory/35 text-center max-w-xs">
                  Verify your phone number first. Each number votes once.
                </p>
              </>
            ) : (
              <p className="font-body text-sm text-ivory/40 text-center">
                Voting ended Jul 23 at 11:59 PM.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="px-6 pb-10 text-center">
        <p className="font-body text-xs text-ivory/25 tracking-wide">
          © Invitation to Light · Cena a la Lus
        </p>
      </footer>
    </main>
  );
}
