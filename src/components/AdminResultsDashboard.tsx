"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { voteCategories as categories, type Nominee } from "@/data/categories";
import type { VoterRecord } from "@/lib/exportResults";

type Tally = Record<string, Record<string, number>>;

export type AdminResultsData = {
  totalVoters: number;
  tally: Tally;
  raw?: VoterRecord[];
};

type ViewMode = "categories" | "directory" | "leaders";
type SortMode = "votes-desc" | "votes-asc" | "name" | "category";
type VoteFilter = "all" | "voted" | "zero";
type Density = "comfortable" | "compact";

type Entry = {
  key: string;
  categoryId: string;
  categoryTitle: string;
  categoryEmoji: string;
  categoryIndex: number;
  nominee: Nominee;
  votes: number;
  categoryTotal: number;
  percentage: number;
  isLeader: boolean;
};

type Props = {
  data: AdminResultsData;
  loading: boolean;
  exporting: boolean;
  lastRefresh: Date | null;
  onRefresh: () => void;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onExportVoters: () => void;
};

function AdminAvatar({
  nominee,
  size = 44,
}: {
  nominee: Nominee;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials = nominee.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl flex items-center justify-center font-display font-bold text-champagne"
      style={{
        width: size,
        height: size,
        background: "rgba(232,200,122,0.1)",
        border: "1px solid rgba(232,200,122,0.18)",
      }}
    >
      {failed ? (
        initials
      ) : (
        <Image
          src={nominee.photo}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className="surface p-4 sm:p-5 min-w-0"
      style={{
        borderRadius: 16,
        background: accent
          ? "linear-gradient(145deg, rgba(107,30,42,0.28), rgba(28,16,10,0.75))"
          : undefined,
      }}
    >
      <p className="font-body text-[0.62rem] uppercase tracking-[0.16em] text-champagne/45 truncate">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold text-champagne tabular-nums">
        {value}
      </p>
      <p className="mt-1 font-body text-xs text-ivory/30 truncate">{detail}</p>
    </div>
  );
}

export default function AdminResultsDashboard({
  data,
  loading,
  exporting,
  lastRefresh,
  onRefresh,
  onExportPdf,
  onExportCsv,
  onExportVoters,
}: Props) {
  const [view, setView] = useState<ViewMode>("categories");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [voteFilter, setVoteFilter] = useState<VoteFilter>("all");
  const [sort, setSort] = useState<SortMode>("votes-desc");
  const [density, setDensity] = useState<Density>("comfortable");
  const [showPhotos, setShowPhotos] = useState(true);

  const entries = useMemo<Entry[]>(() => {
    return categories.flatMap((category, categoryIndex) => {
      const categoryTally = data.tally[category.id] ?? {};
      const categoryTotal = Object.values(categoryTally).reduce(
        (sum, value) => sum + value,
        0
      );
      const maxVotes = Math.max(
        0,
        ...category.nominees.map((nominee) => categoryTally[nominee.id] ?? 0)
      );

      return category.nominees.map((nominee) => {
        const votes = categoryTally[nominee.id] ?? 0;
        return {
          key: `${category.id}:${nominee.id}`,
          categoryId: category.id,
          categoryTitle: category.title,
          categoryEmoji: category.emoji,
          categoryIndex,
          nominee,
          votes,
          categoryTotal,
          percentage: categoryTotal > 0 ? (votes / categoryTotal) * 100 : 0,
          isLeader: maxVotes > 0 && votes === maxVotes,
        };
      });
    });
  }, [data.tally]);

  const metrics = useMemo(() => {
    const totalSelections = entries.reduce((sum, entry) => sum + entry.votes, 0);
    const uniqueNominees = new Set(
      entries.map((entry) => entry.nominee.name.trim().toLocaleLowerCase())
    ).size;
    const zeroVoteEntries = entries.filter((entry) => entry.votes === 0).length;
    const activeCategories = categories.filter((category) => {
      const tally = data.tally[category.id] ?? {};
      return Object.values(tally).some((value) => value > 0);
    }).length;

    return {
      totalSelections,
      uniqueNominees,
      zeroVoteEntries,
      activeCategories,
      averageSelections:
        data.totalVoters > 0
          ? (totalSelections / data.totalVoters).toFixed(1)
          : "0.0",
    };
  }, [data.tally, data.totalVoters, entries]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const result = entries.filter((entry) => {
      if (categoryId !== "all" && entry.categoryId !== categoryId) return false;
      if (voteFilter === "voted" && entry.votes === 0) return false;
      if (voteFilter === "zero" && entry.votes > 0) return false;
      if (view === "leaders" && !entry.isLeader) return false;
      if (
        normalizedQuery &&
        !`${entry.nominee.name} ${entry.categoryTitle}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      ) {
        return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sort === "votes-asc") {
        return a.votes - b.votes || a.nominee.name.localeCompare(b.nominee.name);
      }
      if (sort === "name") {
        return (
          a.nominee.name.localeCompare(b.nominee.name) ||
          a.categoryIndex - b.categoryIndex
        );
      }
      if (sort === "category") {
        return (
          a.categoryIndex - b.categoryIndex ||
          b.votes - a.votes ||
          a.nominee.name.localeCompare(b.nominee.name)
        );
      }
      return b.votes - a.votes || a.nominee.name.localeCompare(b.nominee.name);
    });
  }, [categoryId, entries, query, sort, view, voteFilter]);

  const visibleCategories = useMemo(() => {
    const entryKeys = new Set(filteredEntries.map((entry) => entry.key));
    return categories
      .map((category, index) => ({
        category,
        index,
        entries: entries.filter(
          (entry) =>
            entry.categoryId === category.id && entryKeys.has(entry.key)
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [entries, filteredEntries]);

  function resetControls() {
    setQuery("");
    setCategoryId("all");
    setVoteFilter("all");
    setSort("votes-desc");
    setView("categories");
  }

  return (
    <main className="min-h-[100svh] pb-16">
      <header
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(18,10,6,0.96)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(232,200,122,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="font-body text-[0.62rem] uppercase tracking-[0.25em] text-champagne/45">
              Cena a la Lus
            </p>
            <h1 className="font-display text-2xl font-semibold italic text-champagne">
              Results Command Center
            </h1>
            <p className="font-body text-xs text-ivory/30">
              {lastRefresh
                ? `Updated ${lastRefresh.toLocaleTimeString()}`
                : "Waiting for results"}{" "}
              · Auto-refreshes every 30 seconds
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn-gold"
              style={{ padding: "0.65rem 1.1rem", fontSize: "0.72rem" }}
              onClick={onExportPdf}
              disabled={exporting}
            >
              {exporting ? "Opening…" : "Export PDF"}
            </button>
            <button className="btn-outline text-xs" onClick={onExportCsv}>
              Results CSV
            </button>
            <button
              className="btn-outline text-xs"
              onClick={onExportVoters}
              disabled={!data.raw?.length}
            >
              Voter phones
            </button>
            <button
              className="btn-outline text-xs"
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-7">
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <MetricCard
            label="Voters"
            value={data.totalVoters}
            detail={`${data.raw?.length ?? data.totalVoters} records saved`}
            accent
          />
          <MetricCard
            label="Selections"
            value={metrics.totalSelections}
            detail={`${metrics.averageSelections} per voter`}
          />
          <MetricCard
            label="Nominee entries"
            value={entries.length}
            detail={`Across ${categories.length} categories`}
          />
          <MetricCard
            label="Unique names"
            value={metrics.uniqueNominees}
            detail="Duplicates merged by name"
          />
          <MetricCard
            label="Active categories"
            value={`${metrics.activeCategories}/${categories.length}`}
            detail="At least one vote"
          />
          <MetricCard
            label="Zero-vote entries"
            value={metrics.zeroVoteEntries}
            detail="Still visible below"
          />
        </section>

        <section
          className="surface mt-5 p-4 sm:p-5"
          style={{ borderRadius: 18 }}
        >
          <div className="flex flex-col xl:flex-row gap-4 xl:items-end">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="admin-search"
                className="block mb-2 font-body text-[0.62rem] uppercase tracking-[0.16em] text-champagne/45"
              >
                Search everyone
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/35">
                  ⌕
                </span>
                <input
                  id="admin-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nominee or category…"
                  className="admin-search"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex gap-3">
              <label className="min-w-0">
                <span className="admin-label">Category</span>
                <select
                  className="admin-control"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="min-w-0">
                <span className="admin-label">Vote status</span>
                <select
                  className="admin-control"
                  value={voteFilter}
                  onChange={(event) =>
                    setVoteFilter(event.target.value as VoteFilter)
                  }
                >
                  <option value="all">All nominees</option>
                  <option value="voted">Has votes</option>
                  <option value="zero">Zero votes</option>
                </select>
              </label>

              <label className="min-w-0">
                <span className="admin-label">Sort</span>
                <select
                  className="admin-control"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortMode)}
                >
                  <option value="votes-desc">Most votes</option>
                  <option value="votes-asc">Fewest votes</option>
                  <option value="name">Name A–Z</option>
                  <option value="category">Category order</option>
                </select>
              </label>

              <label className="min-w-0">
                <span className="admin-label">Density</span>
                <select
                  className="admin-control"
                  value={density}
                  onChange={(event) =>
                    setDensity(event.target.value as Density)
                  }
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["categories", "Categories"],
                  ["directory", "All nominees"],
                  ["leaders", "Leaders"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={view === value ? "admin-tab active" : "admin-tab"}
                  onClick={() => setView(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-body text-xs text-ivory/45 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhotos}
                  onChange={(event) => setShowPhotos(event.target.checked)}
                  className="admin-checkbox"
                />
                Show photos
              </label>
              <button
                className="font-body text-xs text-champagne/55 hover:text-champagne"
                onClick={resetControls}
              >
                Reset filters
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between">
          <p className="font-body text-sm text-ivory/45">
            Showing{" "}
            <strong className="text-champagne">{filteredEntries.length}</strong>{" "}
            of <strong className="text-ivory/70">{entries.length}</strong>{" "}
            configured nominee entries
          </p>
          <p className="hidden sm:block font-body text-xs text-ivory/25">
            Zero-vote nominees are included
          </p>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="surface mt-5 py-16 px-6 text-center">
            <p className="font-display text-2xl italic text-champagne">
              No matching nominees
            </p>
            <p className="mt-2 font-body text-sm text-ivory/35">
              Try changing the search, category, or vote-status filter.
            </p>
            <button className="btn-outline mt-5" onClick={resetControls}>
              Clear all filters
            </button>
          </div>
        ) : view === "categories" ? (
          <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-5">
            {visibleCategories.map(({ category, index, entries: group }) => {
              const categoryTotal = group[0]?.categoryTotal ?? 0;
              return (
                <section
                  key={category.id}
                  className="surface overflow-hidden"
                  style={{ borderRadius: 18 }}
                >
                  <header
                    className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4"
                    style={{ borderBottom: "1px solid rgba(232,200,122,0.1)" }}
                  >
                    <div className="min-w-0">
                      <p className="font-body text-[0.6rem] uppercase tracking-[0.18em] text-champagne/40">
                        Category {String(index + 1).padStart(2, "0")} ·{" "}
                        {category.nominees.length} nominees
                      </p>
                      <h2 className="font-display text-lg font-semibold text-champagne truncate">
                        {category.emoji} {category.title}
                      </h2>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl font-semibold text-ivory/70 tabular-nums">
                        {categoryTotal}
                      </p>
                      <p className="font-body text-[0.6rem] uppercase tracking-wider text-ivory/25">
                        votes
                      </p>
                    </div>
                  </header>

                  <div
                    className={
                      density === "compact"
                        ? "divide-y divide-champagne/10"
                        : "p-3 sm:p-4 flex flex-col gap-2"
                    }
                  >
                    {group.map((entry) => (
                      <NomineeResultRow
                        key={entry.key}
                        entry={entry}
                        showPhoto={showPhotos}
                        compact={density === "compact"}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div
            className={
              view === "leaders"
                ? "mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "surface mt-5 overflow-hidden"
            }
            style={view === "directory" ? { borderRadius: 18 } : undefined}
          >
            {view === "directory" && (
              <div className="hidden md:grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_90px_80px] gap-4 px-5 py-3 border-b border-champagne/10 font-body text-[0.62rem] uppercase tracking-[0.14em] text-champagne/40">
                <span>Nominee</span>
                <span>Category</span>
                <span className="text-right">Votes</span>
                <span className="text-right">Share</span>
              </div>
            )}

            {filteredEntries.map((entry) =>
              view === "leaders" ? (
                <LeaderCard
                  key={entry.key}
                  entry={entry}
                  showPhoto={showPhotos}
                />
              ) : (
                <DirectoryRow
                  key={entry.key}
                  entry={entry}
                  showPhoto={showPhotos}
                  compact={density === "compact"}
                />
              )
            )}
          </div>
        )}

        <p className="mt-10 font-body text-xs text-center text-ivory/20">
          Source: {entries.length} configured entries in {categories.length} voting
          categories · Results stored in Supabase
        </p>
      </div>
    </main>
  );
}

function NomineeResultRow({
  entry,
  showPhoto,
  compact,
}: {
  entry: Entry;
  showPhoto: boolean;
  compact: boolean;
}) {
  return (
    <div
      className={`relative ${compact ? "px-4 py-2.5" : "rounded-xl px-3 py-3"}`}
      style={{
        background: compact
          ? "transparent"
          : entry.isLeader
            ? "rgba(232,200,122,0.075)"
            : "rgba(247,240,230,0.02)",
      }}
    >
      <div className="flex items-center gap-3">
        {showPhoto && <AdminAvatar nominee={entry.nominee} size={compact ? 36 : 44} />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p
              className={`font-body truncate ${compact ? "text-xs" : "text-sm"} ${
                entry.isLeader ? "text-ivory" : "text-ivory/65"
              }`}
            >
              {entry.nominee.name}
            </p>
            {entry.isLeader && (
              <span className="shrink-0 rounded-full bg-champagne/15 px-2 py-0.5 font-body text-[0.55rem] uppercase tracking-wider text-champagne">
                Leader
              </span>
            )}
            {entry.votes === 0 && (
              <span className="shrink-0 font-body text-[0.58rem] text-ivory/20">
                No votes
              </span>
            )}
          </div>
          <div className="mt-2 progress-track" style={{ height: 5 }}>
            <div
              className="progress-fill"
              style={{
                width: `${entry.percentage}%`,
                background: entry.isLeader
                  ? "linear-gradient(90deg, #6B1E2A, #E8C87A)"
                  : "rgba(232,200,122,0.28)",
              }}
            />
          </div>
        </div>
        <div className="shrink-0 text-right w-16">
          <p className="font-display text-lg font-semibold text-champagne tabular-nums">
            {entry.votes}
          </p>
          <p className="font-body text-[0.62rem] text-ivory/30 tabular-nums">
            {entry.percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function DirectoryRow({
  entry,
  showPhoto,
  compact,
}: {
  entry: Entry;
  showPhoto: boolean;
  compact: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_90px_80px] gap-3 md:gap-4 items-center px-4 sm:px-5 ${
        compact ? "py-2.5" : "py-3.5"
      } border-b border-champagne/10 last:border-0`}
      style={{
        background: entry.isLeader ? "rgba(232,200,122,0.045)" : undefined,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showPhoto && <AdminAvatar nominee={entry.nominee} size={compact ? 34 : 42} />}
        <div className="min-w-0">
          <p className="font-body text-sm text-ivory/75 truncate">
            {entry.nominee.name}
          </p>
          <div className="flex items-center gap-2 md:hidden">
            <span className="font-body text-xs text-ivory/30 truncate">
              {entry.categoryTitle}
            </span>
            {entry.isLeader && (
              <span className="font-body text-[0.55rem] uppercase text-champagne">
                Leader
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="hidden md:block font-body text-xs text-ivory/40 truncate">
        {entry.categoryEmoji} {entry.categoryTitle}
      </p>
      <p className="font-display text-lg text-right text-champagne tabular-nums">
        {entry.votes}
      </p>
      <p className="hidden md:block font-body text-xs text-right text-ivory/35 tabular-nums">
        {entry.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

function LeaderCard({
  entry,
  showPhoto,
}: {
  entry: Entry;
  showPhoto: boolean;
}) {
  return (
    <div
      className="surface p-4"
      style={{
        borderRadius: 18,
        background:
          "linear-gradient(145deg, rgba(107,30,42,0.2), rgba(28,16,10,0.78))",
      }}
    >
      <div className="flex items-center gap-3">
        {showPhoto && <AdminAvatar nominee={entry.nominee} size={58} />}
        <div className="min-w-0 flex-1">
          <p className="font-body text-[0.58rem] uppercase tracking-[0.14em] text-champagne/45 truncate">
            {entry.categoryEmoji} {entry.categoryTitle}
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold text-ivory truncate">
            {entry.nominee.name}
          </p>
          <p className="mt-1 font-body text-xs text-ivory/35">
            Leading with{" "}
            <strong className="text-champagne">{entry.votes}</strong> votes ·{" "}
            {entry.percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
