import React from "react";
import Canvas from "./Canvas";
import styles from "./index.module.scss";
import useEditStore, { undoCanvas, redoCanvas } from "@/store/editStore";
import Zoom from "./Zoom";
import useZoomStore from "@/store/zoomStore";

const Center: React.FC = () => {
    const setSelected = useEditStore((state) => state.setCompSelected)
    const canvasStyle = useEditStore((state) => state.canvas.style)
    const { zoomIn, zoomOut } = useZoomStore()
    const zoom = useZoomStore((state) => state.zoom)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
        }
        switch (e.code) {
            case "KeyA":
                const index = Array.from({ length: useEditStore.getState().canvas.comps.length }, (_, i) => i)
                setSelected(true, ...index)
                break;
            case "Equal":
                zoomIn()
                break;
            case "Minus":
                zoomOut()
                break;
            case "KeyZ":
                if (e.shiftKey) {
                    redoCanvas()
                } else {
                    undoCanvas()
                }
                break;

        }
    }
    return (
        <div
            className={styles['center']}
            id="canvas-area"
            style={{ minHeight: zoom / 100 * canvasStyle.height + 200 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={() => {
                console.log('center clicked')
                setSelected(true)
            }}
        >
            <Canvas />
            <Zoom />
        </div>
    )
}

export default Center;