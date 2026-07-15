"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVoteStore } from "@/store/voteStore";
import { categories } from "@/data/categories";
import NomineeCard from "@/components/NomineeCard";
import VoteSummary from "@/components/VoteSummary";
import toast from "react-hot-toast";

export default function VotePage() {
  const router = useRouter();
  const { isVerified, votes, setVote, currentCategoryIndex, setCurrentIndex, phone } =
    useVoteStore();
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isVerified) router.replace("/verify");
  }, [isVerified, router]);

  const total = categories.length;
  const current = categories[currentCategoryIndex];
  const selectedNominee = current ? votes[current.id] : undefined;
  const progress = (currentCategoryIndex / total) * 100;

  function handleSelect(nomineeId: string) {
    if (votes[current.id] === nomineeId) {
      setVote(current.id, undefined as unknown as null);
    } else {
      setVote(current.id, nomineeId);
    }
  }

  function handleNext() {
    if (votes[current.id] === undefined) {
      setVote(current.id, null);
    }
    if (currentCategoryIndex < total - 1) {
      setCurrentIndex(currentCategoryIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSummary(true);
    }
  }

  function handleSkip() {
    setVote(current.id, null);
    handleNext();
  }

  function handleBack() {
    if (currentCategoryIndex > 0) {
      setCurrentIndex(currentCategoryIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, votes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/done");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isVerified) return null;

  if (showSummary) {
    return (
      <VoteSummary
        onEdit={(index) => {
          setCurrentIndex(index);
          setShowSummary(false);
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    );
  }

  return (
    <main className="min-h-[100svh] flex flex-col pb-10">
      <div
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(18,10,6,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(232,200,122,0.1)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-body text-xs tracking-wide text-champagne/55">
              Category {currentCategoryIndex + 1} of {total}
            </p>
            <p className="font-body text-xs text-ivory/30">
              {Object.values(votes).filter((v) => v !== undefined).length} done
            </p>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-10">
              <span className="text-3xl mb-3 block opacity-80" aria-hidden>
                {current.emoji}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold italic text-champagne leading-tight">
                {current.title}
              </h1>
              <div className="gold-rule max-w-[10rem] mx-auto mt-5" />
              <p className="font-body text-sm mt-4 text-ivory/40">
                Pick one — or skip if you&apos;d rather not vote here
              </p>
            </div>

            <div
              className={`grid gap-3 mb-10 ${
                current.nominees.length === 2
                  ? "grid-cols-2"
                  : current.nominees.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
              }`}
            >
              {current.nominees.map((nominee) => (
                <NomineeCard
                  key={nominee.id}
                  nominee={nominee}
                  selected={selectedNominee === nominee.id}
                  onSelect={() => handleSelect(nominee.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          <button className="btn-gold w-full" onClick={handleNext}>
            {currentCategoryIndex < total - 1 ? "Next →" : "Review my votes →"}
          </button>

          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={handleBack}
              disabled={currentCategoryIndex === 0}
            >
              ← Back
            </button>
            <button className="btn-outline flex-1" onClick={handleSkip}>
              Skip
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-10 flex-wrap">
          {categories.map((cat, i) => {
            const voted = votes[cat.id] !== undefined;
            const isSkipped = votes[cat.id] === null;
            const isCurrent = i === currentCategoryIndex;
            return (
              <button
                key={cat.id}
                onClick={() => setCurrentIndex(i)}
                title={cat.title}
                className="transition-all duration-200"
                style={{
                  width: isCurrent ? "1.4rem" : "0.4rem",
                  height: "0.4rem",
                  borderRadius: "4px",
                  background: isCurrent
                    ? "#E8C87A"
                    : isSkipped
                      ? "rgba(247,240,230,0.2)"
                      : voted
                        ? "#6B1E2A"
                        : "rgba(232,200,122,0.15)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={cat.title}
              />
            );
          })}
        </div>
        <div className="flex justify-center gap-5 mt-3">
          <span className="flex items-center gap-1.5 text-[0.65rem] text-ivory/25">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ background: "#6B1E2A" }}
            />
            Voted
          </span>
          <span className="flex items-center gap-1.5 text-[0.65rem] text-ivory/25">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ background: "rgba(247,240,230,0.2)" }}
            />
            Skipped
          </span>
        </div>
      </div>
    </main>
  );
}
