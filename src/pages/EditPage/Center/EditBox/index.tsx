import React, { useState } from "react";
import styles from "./index.module.scss";
import useEditStore, { CompTypes } from "@/store/editStore";
import { throttle } from "lodash-es";
import useZoomStore from "@/store/zoomStore";
import Resizers from "./Resizers"
import TextAreaAutosize from 'react-textarea-autosize';

const mainClass = styles['main']

const EditBox: React.FC = () => {
    const comps = useEditStore((state) => state.canvas.comps)
    const zoom = useZoomStore((state) => state.zoom)
    const updateComp = useEditStore((state) => state.updateComp)
    const selectedIndexs = useEditStore((state) => state.selectedIndexs)
    const moveCompByDistance = useEditStore((state) => state.moveCompByDistance)

    const seletedComp = (function () {
        if (selectedIndexs.size === 1) {
            return comps[Array.from(selectedIndexs)[0]]
        }
        return null
    }())

    const [textareaVisible, setTextareaVisible] = useState(false)

    if (selectedIndexs.size === 0) return null
    const handleMove = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        let startX = e.pageX
        let startY = e.pageY
        const move = throttle((e: MouseEvent) => {
            const { pageX, pageY } = e
            const distanceX = pageX - startX
            const distanceY = pageY - startY
            startX = pageX
            startY = pageY
            moveCompByDistance(distanceX * (100 / zoom), distanceY * (100 / zoom))
        }, 1000 / 80)
        const end = () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', end)
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', end)
    }
    let top = 99999,
        left = 99999,
        width = 0,
        height = 0
    const gap = 4
    const computePos = () => {
        let right = 0,
            bottom = 0
        selectedIndexs.forEach((index) => {
            const comp = comps[index]
            if (!comp) return
            top = Math.min(top, comp.style.top as number)
            left = Math.min(left, comp.style.left as number)
            right = Math.max(right, (comp.style.left as number) + comp.style.width as number)
            bottom = Math.max(bottom, (comp.style.top as number) + comp.style.height as number)
        })
        right += gap
        bottom += gap
        left -= gap
        top -= gap
        width = right - left
        height = bottom - top
    }
    computePos()
    console.log(width, height)
    console.log("editbox rendered")
    if (width - 2 * gap === 0 || height - 2 * gap === 0) return null
    return (
        <div
            className={mainClass}
            style={{ top, left, width, height, zIndex: 10 }}
            onMouseDown={handleMove}
            onClick={(e) => { e.stopPropagation() }}
            onDoubleClick={(e) => { e.stopPropagation(); setTextareaVisible(true) }}
        >
            {seletedComp
                && seletedComp.type === CompTypes.TEXT
                && textareaVisible
                && <TextAreaAutosize
                    onBlur={() => setTextareaVisible(false)}
                    value={seletedComp.value}
                    style={{
                        ...seletedComp.style,
                        padding: 0,
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        height: seletedComp.style.height,
                        left: gap,
                        top: gap,
                        position: 'absolute',
                        zIndex: 10000,
                        fontFamily: 'inherit',

                    }}
                    onHeightChange={(height) => { updateComp(undefined, { height: height }) }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => { updateComp({ value: e.currentTarget.value }) }}
                />}
            <Resizers zoom={zoom} width={width} height={height} />
        </div>
    )
}

export default EditBox