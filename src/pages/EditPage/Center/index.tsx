import React, { useState } from "react";
import Canvas from "./Canvas";
import styles from "./index.module.scss";
import useEditStore, { undoCanvas, redoCanvas } from "@/store/editStore";
import Zoom from "./Zoom";
import useZoomStore from "@/store/zoomStore";
import Menu from "./Menu";

const centerClass = styles['center']
const canvasContainerClass = styles['canvas-container']

const Center: React.FC = () => {
    const setSelected = useEditStore((state) => state.setCompSelected)
    const canvasStyle = useEditStore((state) => state.canvas.style)
    const { zoomIn, zoomOut } = useZoomStore()
    const zoom = useZoomStore((state) => state.zoom)

    const [menuLeft, setMenuLeft] = useState<number>(0)
    const [menuTop, setMenuTop] = useState<number>(0)
    const [isMenuShow, setIsMenuShow] = useState<boolean>(false)

    const handleMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsMenuShow(true)
        setMenuLeft(e.clientX)
        setMenuTop(e.clientY)
        console.log('menu clicked')
    }

    const handleCenterClick = () => {
        console.log('center clicked')
        setSelected(true)
        setIsMenuShow(false)
    }

    const handleMenuItemClick = (e: React.MouseEvent) => {
        e.preventDefault()
        console.log('menu item clicked')
        setIsMenuShow(false)
    }

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
            className={centerClass}
            id="canvas-area"
            onKeyDown={handleKeyDown}
            onContextMenu={handleMenu}
            tabIndex={0}
            onClick={handleCenterClick}
        >
            <div className={canvasContainerClass} style={{
                height: canvasStyle.height * zoom / 100,
                width: canvasStyle.width * zoom / 100,
            }}>
                {isMenuShow && <Menu onMenuItemClick={handleMenuItemClick} left={menuLeft} top={menuTop} />}
                <Canvas />
                <Zoom />
            </div>
        </div>
    )
}

export default Center;