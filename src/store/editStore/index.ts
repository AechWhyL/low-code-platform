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
  IComp,
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

    addComp: (...comps) => {
      set((draft) => {
        comps.forEach((comp) => {
          draft.canvas.comps.push({
            ...comp,
            key: getUniqueKey(),
            style: {
              ...comp.style,
              zIndex: draft.canvas.comps.length,
            },
          });
          draft.selectedIndexs.add(draft.canvas.comps.length - 1);
        });
        addCanvasHistory();
      });
    },

    deleteComps: (...indexs) => {
      set((draft) => {
        const newComps = draft.canvas.comps.filter((comp, index) => {
          return !indexs.includes(index);
        });
        draft.canvas.comps = newComps;
        const newSelectedIndexs = new Set<number>();
        draft.selectedIndexs.forEach((index) => {
          if (indexs.includes(index)) {
            return;
          }
          newSelectedIndexs.add(index);
        });
        draft.selectedIndexs = newSelectedIndexs;
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

    updateComp: (index, props?, newStyle?: Partial<CompStyle>) => {
      set((draft) => {
        const comp = draft.canvas.comps[index];
        if (props) {
          Object.assign(comp, props);
        }
        if (newStyle) {
          comp.style = {
            ...comp.style,
            ...newStyle,
          };
        }
        addCanvasHistory();
      });
    },

    updateSelected: (props?, newStyle?: Partial<CompStyle>) => {
      set((draft) => {
        draft.selectedIndexs.forEach((index) => {
          const comp = draft.canvas.comps[index];
          if (props) {
            Object.assign(comp, props);
          }
          if (newStyle) {
            comp.style = {
              ...comp.style,
              ...newStyle,
            };
          }
        });
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

// histories
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

// cv
const copyBuffer: IComp[] = [];
export const copyComps = () => {
  copyBuffer.length = 0;
  useEditStore.getState().selectedIndexs.forEach((index) => {
    const comp = useEditStore.getState().canvas.comps[index];
    const { name, style, type, value, onClick } = comp;
    copyBuffer.push({
      name,
      style,
      type,
      value,
      onClick,
    });
  });
};

// left,top 均为粘贴的位置相对于canvas的left,top
export const pasteComps = (pos?: { left: number; top: number }) => {
  let offsetX = 50,
    offsetY = 50;
  if (pos) {
    const { left, top } = pos;

    //找出最左上方的组件作为锚点参照
    const anchorComp = copyBuffer.reduce((min, comp) => {
      if (
        comp.style.left <= min.style.left &&
        comp.style.top <= min.style.top
      ) {
        return comp;
      }
      return min;
    });
    offsetX = left - anchorComp.style.left;
    offsetY = top - anchorComp.style.top;
  }
  const newComps = copyBuffer.map((comp) => {
    return {
      ...comp,
      style: {
        ...comp.style,
        left: comp.style.left + offsetX,
        top: comp.style.top + offsetY,
      },
    };
  });
  useEditStore.getState().setCompSelected(true);
  useEditStore.getState().addComp(...newComps);
};

export const layerUp = () => {
  useEditStore.setState((draft) => {
    const { canvas, selectedIndexs } = draft;
    const len = canvas.comps.length;
    if (selectedIndexs.size === len) {
      return;
    }
    for (let i = len - 1; i >= 0; i--) {
      if (i + 1 < len && selectedIndexs.has(i) && !selectedIndexs.has(i + 1)) {
        const temp = canvas.comps[i];
        canvas.comps[i] = canvas.comps[i + 1];
        canvas.comps[i + 1] = temp;
        selectedIndexs.delete(i);
        selectedIndexs.add(i + 1);
      }
    }
  });
};

export const layerDown = () => {
  useEditStore.setState((draft) => {
    const { canvas, selectedIndexs } = draft;
    const len = canvas.comps.length;
    if (selectedIndexs.size === len) {
      return;
    }
    for (let i = 0; i < len; i++) {
      if (i - 1 >= 0 && selectedIndexs.has(i) && !selectedIndexs.has(i - 1)) {
        const temp = canvas.comps[i];
        canvas.comps[i] = canvas.comps[i - 1];
        canvas.comps[i - 1] = temp;
        selectedIndexs.delete(i);
        selectedIndexs.add(i - 1);
      }
    }
  });
};

export const layerTop = () => {
  useEditStore.setState((draft) => {
    const { canvas, selectedIndexs } = draft;
    const len = canvas.comps.length;
    const insertIndex = len - 1;
    for (let i = len - 1; i >= 0; i--) {
      if (selectedIndexs.has(i)) {
        // 移至末尾
        const t = canvas.comps.splice(i, 1);
        canvas.comps.splice(insertIndex, 0, ...t);
      }
    }
    const selectedSize = selectedIndexs.size;
    selectedIndexs.clear();
    for (let i = len - selectedSize; i < len; i++) {
      selectedIndexs.add(i);
    }
  });
};

export const layerBottom = () => {
  useEditStore.setState((draft) => {
    const { canvas, selectedIndexs } = draft;
    const len = canvas.comps.length;
    const insertIndex = 0;
    for (let i = 0; i < len; i++) {
      if (selectedIndexs.has(i)) {
        // 移至开头
        const t = canvas.comps.splice(i, 1);
        canvas.comps.splice(insertIndex, 0, ...t);
      }
    }
    const selectedSize = selectedIndexs.size;
    selectedIndexs.clear();
    for (let i = 0; i < selectedSize; i++) {
      selectedIndexs.add(i);
    }
  });
};

export const CompTypes = {
  TEXT: 1,
  IMG: 2,
  GRAPH: 3,
};

export default useEditStore;
