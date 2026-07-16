import { formatPhone } from "@/lib/arkesel";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type VoteRecord = {
  phone: string;
  votes: Record<string, string | null>;
  submittedAt: string;
};

function normalizePhone(phone: string) {
  return formatPhone(phone);
}

export async function hasVoted(phone: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("votes")
    .select("id")
    .eq("phone", normalized)
    .maybeSingle();

  if (error) {
    console.error("hasVoted error:", error);
    throw new Error("Could not check vote status");
  }

  return !!data;
}

export async function saveVote(
  phone: string,
  votes: Record<string, string | null>
): Promise<VoteRecord> {
  const normalized = normalizePhone(phone);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("votes")
    .insert({
      phone: normalized,
      votes,
    })
    .select("phone, votes, submitted_at")
    .single();

  if (error) {
    // Unique violation → already voted
    if (error.code === "23505") {
      throw new Error("This number has already voted.");
    }
    console.error("saveVote error:", error);
    throw new Error("Could not save votes");
  }

  return {
    phone: data.phone,
    votes: data.votes as Record<string, string | null>,
    submittedAt: data.submitted_at,
  };
}

export async function getAllVotes(): Promise<VoteRecord[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("votes")
    .select("phone, votes, submitted_at")
    .order("submitted_at", { ascending: true });

  if (error) {
    console.error("getAllVotes error:", error);
    throw new Error("Could not load votes");
  }

  return (data ?? []).map((row) => ({
    phone: row.phone as string,
    votes: row.votes as Record<string, string | null>,
    submittedAt: row.submitted_at as string,
  }));
}

export function buildTally(records: VoteRecord[]) {
  const tally: Record<string, Record<string, number>> = {};
  for (const record of records) {
    for (const [catId, nomineeId] of Object.entries(record.votes)) {
      if (!nomineeId) continue;
      if (!tally[catId]) tally[catId] = {};
      tally[catId][nomineeId] = (tally[catId][nomineeId] ?? 0) + 1;
    }
  }
  return tally;
}
