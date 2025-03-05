import { create } from "zustand";

export interface ZoomState {
  zoom: number; // percentage
}

export interface ZoomAction {
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
}

const useZoomStore = create<ZoomState & ZoomAction>((set) => {
  return {
    zoom: 100,
    setZoom: (zoom: number) =>
      set((state) => {
        if (zoom > 10 && zoom < 1000) {
          return { ...state, zoom };
        }
        return { ...state };
      }),
    zoomIn: () =>
      set((state) => {
        if (state.zoom < 150) {
          if (state.zoom > 125) {
            return { ...state, zoom: state.zoom + 10 };
          } else {
            return { ...state, zoom: state.zoom + 5 };
          }
        } else {
          return { ...state };
        }
      }),
    zoomOut: () =>
      set((state) => {
        if (state.zoom > 20) {
          if (state.zoom < 25) {
            return { ...state, zoom: state.zoom - 1 };
          } else {
            return { ...state, zoom: state.zoom - 5 };
          }
        }
        return { ...state };
      }),
    zoomReset: () => set({ zoom: 100 }),
  };
});

export default useZoomStore;
