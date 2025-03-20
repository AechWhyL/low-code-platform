import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { getUniqueKey } from "@/utils/index";
import { addHistory, undo, redo } from "./historySlice";

import type {
  EditStoreState,
  EditStoreAction,
  ICanvas,
  CompStyle,
} from "./types";
import { debounce } from "lodash-es";

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
    maxHistory: 100,
    historyIndex: 0,
    history: [{ canvas: getDefaultCanvas(), seletedIndexs: new Set() }],

    addComp: (comp) => {
      set((draft) => {
        draft.canvas.comps.push({
          ...comp,
          key: getUniqueKey(),
          style: {
            ...comp.style,
            zIndex: draft.canvas.comps.length,
          },
        });
        draft.selectedIndexs.add(draft.canvas.comps.length - 1);
        addCanvasHistory();
      });
    },

    clearCanvas: () => {
      set((draft) => {
        draft.canvas = getDefaultCanvas();
        draft.selectedIndexs.clear();
        addCanvasHistory();
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
        addCanvasHistory();
      });
    },

    moveCompByDistance: (x: number, y: number) => {
      set((draft) => {
        draft.selectedIndexs.forEach((index) => {
          const comp = draft.canvas.comps[index];
          comp.style.left! += x;
          comp.style.top! += y;
        });
        addCanvasHistory();
      });
    },

    resizeComp: (vector) => {
      set((draft) => {
        draft.selectedIndexs.forEach((index) => {
          const comp = draft.canvas.comps[index];
          const resizeWidth = comp.style.width + vector.widthDiff;
          comp.style.width = resizeWidth < 20 ? 20 : resizeWidth;
          const resizeHeight = comp.style.height + vector.heightDiff;
          comp.style.height = resizeHeight < 20 ? 20 : resizeHeight;
          comp.style.left += vector.leftDiff;
          comp.style.top += vector.topDiff;
        });
        addCanvasHistory();
      });
    },

    updateComp: (props?, newStyle?: Partial<CompStyle>) => {
      set((draft) => {
        if (props) {
          draft.selectedIndexs.forEach((index) => {
            const comp = draft.canvas.comps[index];
            Object.assign(comp, props);
          });
        }
        if (newStyle) {
          draft.selectedIndexs.forEach((index) => {
            const comp = draft.canvas.comps[index];
            comp.style = {
              ...comp.style,
              ...newStyle,
            };
          });
        }
        addCanvasHistory();
      });
    },
    updateCanvas(title, newStyle) {
      set((draft) => {
        if (title !== undefined && title !== null) {
          draft.canvas.title = title;
        }
        if (newStyle) {
          draft.canvas.style = {
            ...draft.canvas.style,
            ...newStyle,
          };
        }
        addCanvasHistory();
      });
    },
  }))
);

export const undoCanvas = () => {
  useEditStore.setState((draft) => undo(draft));
};

export const addCanvasHistory = debounce(() => {
  useEditStore.setState((draft) => {
    addHistory(draft);
  });
}, 500);

export const redoCanvas = () => {
  useEditStore.setState((draft) => redo(draft));
};

export const CompTypes = {
  TEXT: 1,
  IMG: 2,
  GRAPH: 3,
};

export default useEditStore;
