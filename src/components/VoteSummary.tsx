"use client";

import { useVoteStore } from "@/store/voteStore";
import { categories } from "@/data/categories";

type Props = {
  onEdit: (index: number) => void;
  onSubmit: () => void;
  submitting: boolean;
};

export default function VoteSummary({ onEdit, onSubmit, submitting }: Props) {
  const { votes } = useVoteStore();

  const votedCount = Object.values(votes).filter((v) => v !== null && v !== undefined).length;
  const skippedCount = Object.values(votes).filter((v) => v === null).length;

  return (
    <main className="min-h-[100svh] flex flex-col pb-14">
      <div className="max-w-xl mx-auto w-full px-4 pt-12 pb-8 text-center animate-enter">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-champagne/50 mb-3">
          Almost done
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-champagne">
          Review your votes
        </h1>
        <div className="gold-rule max-w-[10rem] mx-auto mt-5" />
        <p className="font-body text-sm mt-4 text-ivory/40">
          Voted in{" "}
          <span className="text-champagne font-semibold">{votedCount}</span> categories
          {skippedCount > 0 && (
            <>
              {" · "}
              <span className="text-ivory/30">skipped {skippedCount}</span>
            </>
          )}
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full px-4 flex flex-col gap-2.5">
        {categories.map((cat, i) => {
          const nomineeId = votes[cat.id];
          const nominee = cat.nominees.find((n) => n.id === nomineeId);
          const isSkipped = votes[cat.id] === null;

          return (
            <div
              key={cat.id}
              className="surface flex items-center justify-between px-4 py-3.5 gap-3"
              style={{
                borderColor: nominee
                  ? "rgba(232,200,122,0.22)"
                  : "rgba(232,200,122,0.1)",
                borderRadius: "14px",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-[0.65rem] uppercase tracking-wider text-champagne/45 mb-0.5">
                  {String(i + 1).padStart(2, "0")} · {cat.title}
                </p>
                <p
                  className="font-display font-semibold text-sm truncate"
                  style={{
                    color: nominee
                      ? "#F7F0E6"
                      : isSkipped
                        ? "rgba(247,240,230,0.3)"
                        : "rgba(247,240,230,0.22)",
                  }}
                >
                  {nominee ? nominee.name : isSkipped ? "Skipped" : "Not voted"}
                </p>
              </div>
              <button
                onClick={() => onEdit(i)}
                className="btn-ghost text-xs flex-shrink-0"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.85rem" }}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>

      <div className="max-w-xl mx-auto w-full px-4 mt-8 flex flex-col gap-4">
        <p className="font-body text-xs text-center text-ivory/35 leading-relaxed">
          Once submitted, your votes are final. You&apos;ll receive a confirmation SMS.
        </p>
        <button
          className="btn-gold w-full text-base py-4"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Confirm & submit votes"}
        </button>
      </div>
    </main>
  );
}
