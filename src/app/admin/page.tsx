"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminResultsDashboard, {
  type AdminResultsData,
} from "@/components/AdminResultsDashboard";
import {
  exportResultsCsv,
  exportResultsPdf,
  exportVotersCsv,
} from "@/lib/exportResults";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async (adminSecret: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/submit-votes?secret=${encodeURIComponent(adminSecret)}`,
        { cache: "no-store" }
      );
      const json = await response.json();

      if (response.status === 401) {
        setError("Wrong password.");
        setAuthed(false);
        return;
      }
      if (!response.ok) {
        throw new Error(json.error || "Failed to load results");
      }

      setData(json);
      setAuthed(true);
      setLastRefresh(new Date());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load data.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchData(secret), 30_000);
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
    toast.success(
      `Exported ${count} phone number${count === 1 ? "" : "s"}`
    );
  }

  if (!authed || !data) {
    return (
      <main className="min-h-[100svh] flex items-center justify-center px-6">
        <div className="surface p-8 sm:p-10 w-full max-w-sm text-center">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-champagne/50 mb-3">
            Invitation to Light
          </p>
          <h1 className="font-display text-3xl font-semibold italic text-champagne mb-2">
            Admin Dashboard
          </h1>
          <p className="font-body text-xs text-ivory/35 mb-6">
            Results, nominee coverage, and exports
          </p>
          <div className="gold-rule mb-6" />
          <input
            type="password"
            placeholder="Admin password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" && fetchData(secret)
            }
            autoFocus
            className="verify-input"
          />
          {error && <p className="mt-2 text-xs text-ember">{error}</p>}
          <button
            className="btn-gold w-full mt-5"
            onClick={() => fetchData(secret)}
            disabled={loading || !secret}
          >
            {loading ? "Loading dashboard…" : "Enter dashboard"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <AdminResultsDashboard
      data={data}
      loading={loading}
      exporting={exporting}
      lastRefresh={lastRefresh}
      onRefresh={() => fetchData(secret)}
      onExportPdf={handleExportPdf}
      onExportCsv={handleExportCsv}
      onExportVoters={handleExportVoters}
    />
  );
}
