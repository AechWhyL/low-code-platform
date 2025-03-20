import React, { useRef } from "react";
import styles from "./index.module.scss";
import useEditStore from "@/store/editStore";
import type { IComp } from "@/store/editStore/types";
import Comp from "../Comp";
import EditBox from "../EditBox";
import useZoomStore from "@/store/zoomStore";
const CanvasClass = styles['canvas']

const Canvas: React.FC = () => {

    const canvas = useEditStore((state) => state.canvas);
    const selectedIndexs = useEditStore((state) => state.selectedIndexs)
    const addComp = useEditStore((state) => state.addComp)
    const zoom = useZoomStore((state) => state.zoom)
    const canvasRef = useRef<HTMLDivElement | null>(null)
    const onDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        if (!canvasRef.current) return
        const event = e.nativeEvent
        const jsonData = e.dataTransfer.getData('drag-comp')
        if (!jsonData) return
        const data = JSON.parse(jsonData)
        const comp = data as unknown as IComp

        const width = comp.style.width * zoom / 100 as number
        const height = comp.style.height * zoom /100 as number

        const { pageX, pageY } = event
        const canvasTop = canvasRef.current.getBoundingClientRect().top + window.scrollY
        const canvasLeft = canvasRef.current.getBoundingClientRect().left + window.scrollX
        const destX = pageX - canvasLeft - width / 2
        const destY = pageY - canvasTop - height / 2

        comp.style.left = destX * (100 / zoom)
        comp.style.top = destY * (100 / zoom)
        addComp(comp)
    }
    console.log("canvas rendered")
    return (
        <div
            className={CanvasClass}
            ref={canvasRef}
            style={{
                ...canvas.style,
                transform: `scale(${zoom / 100})`
            }}
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={onDrop}
        >
            <EditBox />
            {canvas.comps.map((comp, index) => {
                const { key } = comp
                return (
                    <Comp
                        key={key}
                        isSelected={selectedIndexs.has(index)}
                        comp={comp}
                        index={index}
                    />
                )
            })}
        </div>
    )
}

export default Canvas;