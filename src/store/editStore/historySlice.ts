import { EditStoreState } from "./types";
import { WritableDraft } from "immer";

export const addHistory = (draft: WritableDraft<EditStoreState>) => {
  if (draft.history.length > draft.maxHistory) {
    draft.history.shift();
  }
  if (draft.historyIndex < draft.history.length - 1) {
    draft.history = draft.history.slice(0, draft.historyIndex + 1);
  }
  draft.history.push({
    canvas: draft.canvas,
    seletedIndexs: draft.selectedIndexs,
  });
  draft.historyIndex = draft.history.length - 1;
};

export const undo = (draft: WritableDraft<EditStoreState>) => {
  draft.historyIndex = draft.historyIndex - 1;
  if (draft.historyIndex < 0) {
    draft.historyIndex = 0;
    return;
  }
  const history = draft.history[draft.historyIndex];
  draft.canvas = history.canvas;
  draft.selectedIndexs = history.seletedIndexs;
};

export const redo = (draft: WritableDraft<EditStoreState>) => {
  draft.historyIndex++;
  if (draft.historyIndex >= draft.history.length) {
    draft.historyIndex = draft.history.length - 1;
    return;
  }
  const history = draft.history[draft.historyIndex];
  draft.canvas = history.canvas;
  draft.selectedIndexs = history.seletedIndexs;
};
