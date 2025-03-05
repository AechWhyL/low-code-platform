import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GlobalState, GlobalStateAction } from "./types";
const useGlobalState = create<GlobalState & GlobalStateAction>()(
  immer((set) => {
    return {
      loading: false,
      setLoading: (loading) => {
        set((draft) => {
          draft.loading = loading;
        });
      },
    };
  })
);

export default useGlobalState;
