"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Nominee } from "@/data/categories";

type Props = {
  nominee: Nominee;
  selected: boolean;
  onSelect: () => void;
};

export default function NomineeCard({ nominee, selected, onSelect }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const initials = nominee.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <>
      <div
        className={`nominee-card surface flex flex-col w-full overflow-hidden ${
          selected ? "selected" : ""
        }`}
        style={{
          borderColor: selected ? "#E8C87A" : "rgba(232,200,122,0.14)",
          background: selected ? "rgba(232,200,122,0.1)" : "rgba(28,16,10,0.72)",
          borderRadius: "14px",
        }}
      >
        {/* Photo — tap to enlarge */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative w-full aspect-[3/4] bg-ink-soft group"
          aria-label={`View full photo of ${nominee.name}`}
        >
          {!imgFailed ? (
            <Image
              src={nominee.photo}
              alt={nominee.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 220px"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center font-display font-bold text-3xl"
              style={{
                background: "rgba(28,16,10,0.92)",
                color: selected ? "#E8C87A" : "rgba(232,200,122,0.45)",
              }}
            >
              {initials}
            </div>
          )}

          <span
            className="absolute bottom-2 right-2 rounded-full px-2.5 py-1 text-[0.65rem] font-body tracking-wide uppercase"
            style={{
              background: "rgba(18,10,6,0.75)",
              color: "rgba(247,240,230,0.85)",
              backdropFilter: "blur(6px)",
            }}
          >
            View
          </span>

          {selected && (
            <span
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#E8C87A", color: "#120A06" }}
              aria-hidden
            >
              ✓
            </span>
          )}
        </button>

        {/* Select hit area */}
        <button
          type="button"
          onClick={onSelect}
          className="flex flex-col items-center gap-1 px-3 py-3 text-center w-full"
          aria-pressed={selected}
        >
          <p
            className="font-display font-semibold text-sm sm:text-base leading-snug"
            style={{ color: selected ? "#E8C87A" : "#F7F0E6" }}
          >
            {nominee.name}
          </p>
          <span className="font-body text-[0.65rem] uppercase tracking-wider text-champagne/45">
            {selected ? "Selected" : "Tap to select"}
          </span>
        </button>
      </div>

      {/* Full-size lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${nominee.name} — full photo`}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
          style={{ background: "rgba(8,4,2,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 btn-ghost z-10"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ✕ Close
          </button>

          <div
            className="relative w-full max-w-lg max-h-[75svh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {!imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nominee.photo}
                alt={nominee.name}
                className="max-w-full max-h-[75svh] w-auto h-auto object-contain rounded-lg"
                style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.5)" }}
              />
            ) : (
              <div className="font-display text-4xl text-champagne">{initials}</div>
            )}
          </div>

          <p className="mt-4 font-display text-xl italic text-champagne text-center">
            {nominee.name}
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(false);
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-gold"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
                setLightbox(false);
              }}
            >
              {selected ? "Selected ✓" : "Select this nominee"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
