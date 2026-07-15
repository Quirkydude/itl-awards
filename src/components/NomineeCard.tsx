"use client";

import Image from "next/image";
import { Nominee } from "@/data/categories";

type Props = {
  nominee: Nominee;
  selected: boolean;
  onSelect: () => void;
};

export default function NomineeCard({ nominee, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`nominee-card surface flex flex-col items-center p-4 gap-3 text-center w-full ${
        selected ? "selected" : ""
      }`}
      style={{
        borderColor: selected ? "#E8C87A" : "rgba(232,200,122,0.14)",
        background: selected ? "rgba(232,200,122,0.1)" : "rgba(28,16,10,0.72)",
      }}
      aria-pressed={selected}
    >
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0"
        style={{
          border: selected ? "2px solid #E8C87A" : "2px solid rgba(232,200,122,0.2)",
          boxShadow: selected ? "0 0 18px rgba(201,162,39,0.35)" : "none",
        }}
      >
        <Image
          src={nominee.photo}
          alt={nominee.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/nominees/placeholder.svg";
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl"
          style={{
            background: "rgba(28,16,10,0.92)",
            color: selected ? "#E8C87A" : "rgba(232,200,122,0.45)",
          }}
        >
          {nominee.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </div>

      <p
        className="font-display font-semibold text-sm sm:text-base leading-tight"
        style={{ color: selected ? "#E8C87A" : "#F7F0E6" }}
      >
        {nominee.name}
      </p>

      {selected && (
        <div
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "#E8C87A", color: "#120A06" }}
          aria-hidden
        >
          ✓
        </div>
      )}
    </button>
  );
}
