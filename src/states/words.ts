import { Word } from "@prisma/client";
import { create } from "zustand";

interface IStates {
  words?: Array<Word>;
  setWords: (words: Array<Word>) => void;
}

export const useWordsStore = create<IStates>()((set) => ({
  setWords: (words) => set({ words }),
}));
