"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { voteCategories as categories } from "@/data/categories";
import {
  exportResultsCsv,
  exportResultsPdf,
  exportVotersCsv,
  type VoterRecord,
} from "@/lib/exportResults";

type Tally = Record<string, Record<string, number>>;
type AdminData = {
  totalVoters: number;
  tally: Tally;
  raw?: VoterRecord[];
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
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

  function handleExportPdf() {
    if (!data) return;
    setExporting(true);
    try {
      exportResultsPdf({
        totalVoters: data.totalVoters,
        tally: data.tally,
      });
      toast.success("Print dialog opening — choose Save as PDF");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  function handleExportCsv() {
    if (!data) return;
    exportResultsCsv(data.tally, data.totalVoters);
    toast.success("Results CSV downloaded");
  }

  function handleExportVoters() {
    if (!data?.raw?.length) {
      toast.error("No voter phone numbers yet");
      return;
    }
    const count = exportVotersCsv(data.raw);
    toast.success(`Exported ${count} phone number${count === 1 ? "" : "s"}`);
  }

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
            className="verify-input"
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
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold italic text-champagne">
              Live Results
            </h1>
            <p className="font-body text-xs text-ivory/30">
              {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : ""} · Auto-refreshes
              every 30s
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
              <p className="font-body text-[0.65rem] text-ivory/35">Total voters</p>
            </div>
            <button
              className="btn-gold text-xs px-4 py-2"
              style={{ padding: "0.65rem 1.1rem", fontSize: "0.75rem" }}
              onClick={handleExportPdf}
              disabled={exporting || !data}
            >
              {exporting ? "…" : "Export PDF"}
            </button>
            <button
              className="btn-outline text-xs px-3 py-2"
              onClick={handleExportCsv}
              disabled={!data}
            >
              Results CSV
            </button>
            <button
              className="btn-outline text-xs px-3 py-2"
              onClick={handleExportVoters}
              disabled={!data?.raw?.length}
            >
              Phones
            </button>
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

      {/* Export callout */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div
          className="surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
          style={{ borderRadius: "16px" }}
        >
          <div>
            <p className="font-display text-lg italic text-champagne mb-1">
              Export results
            </p>
            <p className="font-body text-xs text-ivory/40 leading-relaxed max-w-md">
              PDF = branded tally sheet. Results CSV = vote counts. Phones CSV = voter numbers for
              outreach ({data?.raw?.length ?? 0} saved).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button className="btn-gold" onClick={handleExportPdf} disabled={!data || exporting}>
              Export PDF
            </button>
            <button className="btn-outline" onClick={handleExportCsv} disabled={!data}>
              Results CSV
            </button>
            <button
              className="btn-outline"
              onClick={handleExportVoters}
              disabled={!data?.raw?.length}
            >
              Export phones
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
                  <p className="font-body text-[0.65rem] text-ivory/25">votes</p>
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
        Votes are stored in Supabase. Export anytime for backups / outreach.
      </p>
    </main>
  );
}
