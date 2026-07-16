export type VoteRecord = {
  phone: string;
  votes: Record<string, string | null>;
  submittedAt: string;
};

/** In-memory vote store — replace with a DB for production / multi-instance. */
export const allVotes: VoteRecord[] = [];
