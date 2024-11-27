// /src/store/atoms/filterAtom.ts
import { atom } from "recoil";

export type Filter = "All" | "Completed" | "Pending";

export const filterState = atom<Filter>({
  key: "filterState",
  default: "All", // Default filter is "All"
});
