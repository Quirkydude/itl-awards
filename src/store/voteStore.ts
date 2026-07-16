"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  resetAfterSubmission: () => void;
};

export const useVoteStore = create<VoteStore>()(
  persist(
    (set) => ({
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
      resetAfterSubmission: () =>
        set({
          votes: {},
          phone: "",
          isVerified: false,
          currentCategoryIndex: 0,
        }),
    }),
    {
      name: "itl-voting-progress",
      storage: createJSONStorage(() => localStorage),
      // Verification is authoritative in the signed HTTP-only cookie.
      partialize: (state) => ({
        votes: state.votes,
        phone: state.phone,
        currentCategoryIndex: state.currentCategoryIndex,
      }),
    }
  )
);
