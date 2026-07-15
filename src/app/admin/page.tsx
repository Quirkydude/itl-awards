"use client";

import { useEffect, useState, useCallback } from "react";
import { categories } from "@/data/categories";

type Tally = Record<string, Record<string, number>>;
type AdminData = {
  totalVoters: number;
  tally: Tally;
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/submit-votes?secret=${encodeURIComponent(s)}`);
      if (res.status === 401) {
        setError("Wrong password.");
        setAuthed(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchData(secret), 30000);
    return () => clearInterval(interval);
  }, [authed, secret, fetchData]);

  if (!authed) {
    return (
      <main className="min-h-[100svh] flex items-center justify-center px-6">
        <div className="surface p-8 sm:p-10 w-full max-w-sm text-center">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-champagne/50 mb-3">
            Invitation to Light
          </p>
          <h1 className="font-display text-3xl font-semibold italic text-champagne mb-2">
            Admin
          </h1>
          <p className="font-body text-xs text-ivory/35 mb-6">
            Live vote results — restricted access
          </p>
          <div className="gold-rule mb-6" />
          <input
            type="password"
            placeholder="Admin password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData(secret)}
            autoFocus
          />
          {error && <p className="mt-2 text-xs text-ember">{error}</p>}
          <button
            className="btn-gold w-full mt-5"
            onClick={() => fetchData(secret)}
            disabled={loading || !secret}
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] pb-16">
      <div
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(18,10,6,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(232,200,122,0.12)",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold italic text-champagne">
              Live Results
            </h1>
            <p className="font-body text-xs text-ivory/30">
              {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : ""} · Auto-refreshes
              every 30s
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-xl text-center"
              style={{
                background: "rgba(232,200,122,0.08)",
                border: "1px solid rgba(232,200,122,0.25)",
              }}
            >
              <p className="font-display text-2xl font-bold text-champagne">
                {data?.totalVoters ?? 0}
              </p>
              <p className="font-body text-[0.65rem] text-ivory/35">
                Total voters
              </p>
            </div>
            <button
              className="btn-outline text-xs px-3 py-2"
              onClick={() => fetchData(secret)}
              disabled={loading}
            >
              {loading ? "…" : "↻ Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 flex flex-col gap-5">
        {categories.map((cat, i) => {
          const catTally = data?.tally?.[cat.id] ?? {};
          const totalVotesForCat = Object.values(catTally).reduce((a, b) => a + b, 0);
          const sorted = [...cat.nominees].sort(
            (a, b) => (catTally[b.id] ?? 0) - (catTally[a.id] ?? 0)
          );
          const leader = sorted[0];

          return (
            <div key={cat.id} className="surface p-5" style={{ borderRadius: "16px" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-body text-[0.65rem] uppercase tracking-wider text-champagne/45 mb-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-display text-base font-semibold text-champagne">
                    {cat.emoji} {cat.title}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-ivory/55">
                    {totalVotesForCat}
                  </p>
                  <p className="font-body text-[0.65rem] text-ivory/25">
                    votes
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {sorted.map((nominee) => {
                  const count = catTally[nominee.id] ?? 0;
                  const pct = totalVotesForCat > 0 ? (count / totalVotesForCat) * 100 : 0;
                  const isLeader = nominee.id === leader?.id && count > 0;

                  return (
                    <div key={nominee.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {isLeader && <span className="text-xs">👑</span>}
                          <span
                            className="font-body text-sm"
                            style={{
                              color: isLeader ? "#F7F0E6" : "rgba(247,240,230,0.5)",
                            }}
                          >
                            {nominee.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-display text-sm font-semibold"
                            style={{
                              color: isLeader ? "#E8C87A" : "rgba(247,240,230,0.35)",
                            }}
                          >
                            {count}
                          </span>
                          <span className="font-body text-xs w-10 text-right text-ivory/25">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="progress-track" style={{ height: "4px" }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${pct}%`,
                            background: isLeader
                              ? "linear-gradient(90deg, #6B1E2A, #E8C87A)"
                              : "rgba(232,200,122,0.22)",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {totalVotesForCat === 0 && (
                  <p className="font-body text-xs text-center py-2 text-ivory/20">
                    No votes yet
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="max-w-3xl mx-auto px-4 mt-10 font-body text-xs text-center text-ivory/20">
        Results are in-memory and reset on server restart.
      </p>
    </main>
  );
}
