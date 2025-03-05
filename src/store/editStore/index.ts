import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { getUniqueKey } from "@/utils/index";
import type { EditStoreState, EditStoreAction, ICanvas, IComp } from "./types";

const getDefaultCanvas = (): ICanvas => {
  return {
    title: "未命名画布",
    style: {
      width: 320,
      height: 500,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    comps: [],
  };
};

enableMapSet();

const useEditStore = create<EditStoreState & EditStoreAction>()(
  immer((set) => ({
    canvas: getDefaultCanvas(),
    selectedIndexs: new Set(),
    addComp: (comp: IComp) => {
      set((draft) => {
        draft.canvas.comps.push({
          ...comp,
          key: getUniqueKey(),
        });
        draft.selectedIndexs.add(draft.canvas.comps.length - 1);
      });
    },
    clearCanvas: () => {
      set((draft) => {
        draft.canvas = getDefaultCanvas();
        draft.selectedIndexs.clear();
      });
    },
    setCompSelected: (clear: boolean, ...args) => {
      set((draft) => {
        if (clear) {
          draft.selectedIndexs.clear();
        }
        const indexes = [...args];
        console.log(draft.selectedIndexs.size);
        console.log(indexes);
        indexes.forEach((index) => {
          if (draft.selectedIndexs.has(index)) {
            console.log("delete", index);
            draft.selectedIndexs.delete(index);
          } else {
            draft.selectedIndexs.add(index);
          }
        });
      });
    },
    moveCompByDistance: (x: number, y: number) => {
      set((draft) => {
        draft.selectedIndexs.forEach((index) => {
          const comp = draft.canvas.comps[index];
          comp.style.left! += x;
          comp.style.top! += y;
        });
      });
    },
    resizeComp: (vector) => {
      set((draft) => {
        draft.selectedIndexs.forEach((index) => {
          const comp = draft.canvas.comps[index];
          comp.style.width += vector.widthDiff;
          comp.style.height += vector.heightDiff;
          comp.style.left += vector.leftDiff;
          comp.style.top += vector.topDiff;
        });
      });
    },
  }))
);

export const CompTypes = {
  TEXT: 1,
  IMG: 2,
  GRAPH: 3,
};

export default useEditStore;
