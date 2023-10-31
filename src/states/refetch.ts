import { create } from "zustand";

interface IRefetch {
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
}

export const useRefetchStore = create<IRefetch>()((set) => ({
  refetch: false,
  setRefetch: (refetch) => set({ refetch }),
}));
