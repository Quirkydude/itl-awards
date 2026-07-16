"use client";

import { voteCategories } from "@/data/categories";

type Tally = Record<string, Record<string, number>>;

type Props = {
  totalVoters: number;
  tally: Tally;
  generatedAt: Date;
};

function buildPrintHtml({ totalVoters, tally, generatedAt }: Props) {
  const rows = voteCategories
    .map((cat, i) => {
      const catTally = tally[cat.id] ?? {};
      const total = Object.values(catTally).reduce((a, b) => a + b, 0);
      const sorted = [...cat.nominees].sort(
        (a, b) => (catTally[b.id] ?? 0) - (catTally[a.id] ?? 0)
      );
      const leaderId = sorted[0] && (catTally[sorted[0].id] ?? 0) > 0 ? sorted[0].id : null;

      const nomineeRows = sorted
        .map((n, rank) => {
          const count = catTally[n.id] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isLeader = n.id === leaderId;
          return `
            <tr class="${isLeader ? "leader" : ""}">
              <td class="rank">${rank + 1}</td>
              <td class="name">${escapeHtml(n.name)}${isLeader ? ' <span class="badge">Leading</span>' : ""}</td>
              <td class="num">${count}</td>
              <td class="num">${pct}%</td>
              <td class="bar-cell">
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
              </td>
            </tr>`;
        })
        .join("");

      return `
        <section class="category">
          <header class="cat-head">
            <div>
              <p class="cat-index">Category ${String(i + 1).padStart(2, "0")}</p>
              <h2>${escapeHtml(cat.title)}</h2>
            </div>
            <div class="cat-total">
              <strong>${total}</strong>
              <span>votes</span>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nominee</th>
                <th>Votes</th>
                <th>%</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${
                nomineeRows ||
                `<tr><td colspan="5" class="empty">No nominees / no votes</td></tr>`
              }
            </tbody>
          </table>
        </section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Cena a la Lus — Vote Results</title>
  <style>
    @page { margin: 16mm 14mm; size: A4; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      color: #1a1008;
      background: #faf6ef;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .wrap { max-width: 800px; margin: 0 auto; padding: 24px 20px 40px; }
    .cover {
      text-align: center;
      padding: 28px 16px 24px;
      border-bottom: 2px solid #c9a227;
      margin-bottom: 28px;
      background: linear-gradient(180deg, #fffdf8 0%, #f7f0e6 100%);
    }
    .eyebrow {
      font-family: system-ui, sans-serif;
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #8a6e18;
      margin: 0 0 8px;
    }
    .cover h1 {
      font-size: 36px;
      font-style: italic;
      font-weight: 700;
      color: #6b1e2a;
      margin: 0 0 6px;
    }
    .cover .sub {
      font-family: system-ui, sans-serif;
      font-size: 13px;
      color: #5c4a3a;
      margin: 0;
    }
    .meta {
      display: flex;
      justify-content: center;
      gap: 28px;
      margin-top: 18px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      color: #3d2e22;
    }
    .meta strong {
      display: block;
      font-size: 22px;
      color: #6b1e2a;
      font-family: Georgia, serif;
    }
    .category {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 22px;
      padding: 14px 16px 10px;
      background: #fff;
      border: 1px solid #e6d5b0;
      border-radius: 10px;
    }
    .cat-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #efe2c4;
    }
    .cat-index {
      font-family: system-ui, sans-serif;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #a67c00;
      margin: 0 0 2px;
    }
    .cat-head h2 {
      margin: 0;
      font-size: 17px;
      color: #1a1008;
    }
    .cat-total {
      text-align: right;
      font-family: system-ui, sans-serif;
    }
    .cat-total strong {
      display: block;
      font-size: 20px;
      font-family: Georgia, serif;
      color: #6b1e2a;
    }
    .cat-total span {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8a7a68;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: system-ui, sans-serif;
      font-size: 12px;
    }
    th {
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8a7a68;
      padding: 4px 6px;
      border-bottom: 1px solid #efe2c4;
    }
    td {
      padding: 8px 6px;
      border-bottom: 1px solid #f3ead8;
      vertical-align: middle;
    }
    td.rank { width: 28px; color: #8a7a68; }
    td.num { width: 48px; text-align: right; font-variant-numeric: tabular-nums; }
    td.name { font-weight: 500; color: #2a1c12; }
    tr.leader td.name { color: #6b1e2a; font-weight: 700; }
    tr.leader td.num { color: #a67c00; font-weight: 700; }
    .badge {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 7px;
      border-radius: 999px;
      background: #f0d78a;
      color: #3d2a00;
      font-size: 9px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .bar-cell { width: 28%; }
    .bar-track {
      height: 6px;
      background: #f0e6d4;
      border-radius: 99px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6b1e2a, #c9a227);
      border-radius: 99px;
    }
    tr.leader .bar-fill {
      background: linear-gradient(90deg, #6b1e2a, #e8c87a);
    }
    .empty { text-align: center; color: #a89888; padding: 12px !important; }
    .footer {
      margin-top: 28px;
      text-align: center;
      font-family: system-ui, sans-serif;
      font-size: 10px;
      color: #9a8a78;
    }
    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      .wrap { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="cover">
      <p class="eyebrow">Invitation to Light</p>
      <h1>Cena a la Lus</h1>
      <p class="sub">Dinner &amp; Awards Night — Official Vote Results</p>
      <div class="meta">
        <div><strong>${totalVoters}</strong>Total voters</div>
        <div><strong>${voteCategories.length}</strong>Categories</div>
        <div><strong>${generatedAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}</strong>Generated</div>
      </div>
    </div>
    ${rows}
    <p class="footer">
      Generated ${escapeHtml(generatedAt.toLocaleString())} · Invitation to Light · Cena a la Lus
    </p>
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 250);
    };
  </script>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportResultsPdf(props: Omit<Props, "generatedAt"> & { generatedAt?: Date }) {
  const html = buildPrintHtml({
    ...props,
    generatedAt: props.generatedAt ?? new Date(),
  });
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!win) {
    throw new Error("Pop-up blocked. Allow pop-ups to export the PDF.");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

export function exportResultsCsv(tally: Tally, totalVoters: number) {
  const lines = ["Category,Nominee,Votes,Percentage,Total Category Votes,Total Voters"];
  for (const cat of voteCategories) {
    const catTally = tally[cat.id] ?? {};
    const total = Object.values(catTally).reduce((a, b) => a + b, 0);
    for (const n of cat.nominees) {
      const count = catTally[n.id] ?? 0;
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      lines.push(
        [
          csvEscape(cat.title),
          csvEscape(n.name),
          String(count),
          pct,
          String(total),
          String(totalVoters),
        ].join(",")
      );
    }
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cena-a-la-lus-results-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type VoterRecord = {
  phone: string;
  submittedAt: string;
  votes?: Record<string, string | null>;
};

/** Export unique voter phone numbers for outreach / ads. */
export function exportVotersCsv(voters: VoterRecord[]) {
  const lines = ["Phone,Submitted At,Categories Voted"];
  const seen = new Set<string>();

  for (const v of voters) {
    const phone = (v.phone || "").trim();
    if (!phone || seen.has(phone)) continue;
    seen.add(phone);

    const votedCount = v.votes
      ? Object.values(v.votes).filter((x) => x !== null && x !== undefined).length
      : "";

    lines.push(
      [csvEscape(phone), csvEscape(v.submittedAt || ""), String(votedCount)].join(",")
    );
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cena-a-la-lus-voters-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  return seen.size;
}

function csvEscape(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
