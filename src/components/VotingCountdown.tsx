"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownParts } from "@/lib/votingDeadline";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function VotingCountdown() {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getCountdown());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className="h-[4.5rem] w-full max-w-sm opacity-30" aria-hidden />
    );
  }

  if (parts.ended) {
    return (
      <div className="text-center">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-champagne/50 mb-2">
          Voting closed
        </p>
        <p className="font-display text-xl italic text-ivory/70">
          Thank you — results coming soon
        </p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Mins", value: parts.minutes },
    { label: "Secs", value: parts.seconds },
  ];

  return (
    <div className="w-full max-w-md">
      <p className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-champagne/55 text-center mb-3">
        Voting ends Jul 23 · 11:59 PM
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="text-center rounded-xl px-1 py-3"
            style={{
              background: "rgba(28,16,10,0.55)",
              border: "1px solid rgba(232,200,122,0.18)",
            }}
          >
            <p className="font-display text-2xl sm:text-3xl font-semibold text-champagne tabular-nums leading-none">
              {pad(u.value)}
            </p>
            <p className="mt-1.5 font-body text-[0.6rem] uppercase tracking-wider text-ivory/35">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
