"use client";
import { create } from "zustand";

type VoteStore = {
  // categoryId → nomineeId (null means explicitly skipped, undefined means not yet visited)
  votes: Record<string, string | null>;
  phone: string;
  isVerified: boolean;
  currentCategoryIndex: number;

  setVote: (categoryId: string, nomineeId: string | null) => void;
  setPhone: (phone: string) => void;
  setVerified: (val: boolean) => void;
  setCurrentIndex: (index: number) => void;
  clearVotes: () => void;
};

export const useVoteStore = create<VoteStore>((set) => ({
  votes: {},
  phone: "",
  isVerified: false,
  currentCategoryIndex: 0,

  setVote: (categoryId, nomineeId) =>
    set((state) => ({
      votes: { ...state.votes, [categoryId]: nomineeId },
    })),

  setPhone: (phone) => set({ phone }),
  setVerified: (val) => set({ isVerified: val }),
  setCurrentIndex: (index) => set({ currentCategoryIndex: index }),
  clearVotes: () => set({ votes: {}, currentCategoryIndex: 0 }),
}));
