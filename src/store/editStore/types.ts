import React from "react";
export interface CompStyle extends React.CSSProperties {
  width: number;
  height: number;
  top: number;
  left: number;
}
export interface CanvasStyle extends React.CSSProperties {
  width: number;
  height: number;
}

export interface ICanvas {
  title: string;
  style: CanvasStyle;
  comps: ICompWithKey[];
}

export interface IComp {
  name?: string;
  type: number;
  style: CompStyle;
  value: string;
  onClick?: string;
}

export interface ICompWithKey extends IComp {
  key: number;
}

// 画布状态
export type EditStoreState = {
  canvas: ICanvas;
  selectedIndexs: Set<number>;
  maxHistory: number;
  history: Array<{ canvas: ICanvas; seletedIndexs: Set<number> }>;
  historyIndex: number;
};

export type AddCompFC = (comp: IComp) => void;

// 画布action
export type EditStoreAction = {
  addComp: AddCompFC;
  clearCanvas: () => void;
  setCompSelected: (clear: boolean, ...indexes: number[]) => void;
  moveCompByDistance: (x: number, y: number) => void;
  resizeComp: (vector: {
    topDiff: number;
    leftDiff: number;
    widthDiff: number;
    heightDiff: number;
  }) => void;
  updateComp: <T extends keyof Omit<IComp, "type" | "style">>(
    props?: Partial<Record<T, IComp[T]>>,
    newStyle?: Partial<CompStyle>
  ) => void;
  updateCanvas: (title?: string, newStyle?: Partial<CanvasStyle>) => void;
};

export interface IEditorStore extends EditStoreState, EditStoreAction {}
