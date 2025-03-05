import React from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import useEditStore from "@/store/editStore";

const resizerClass = styles['resizer']

const topLeftClass = styles['top-left']
const topRightClass = styles['top-right']
const bottomLeftClass = styles['bottom-left']
const bottomRightClass = styles['bottom-right']

const leftMidClass = styles['left-middle']
const rightMidClass = styles['right-middle']
const topMidClass = styles['top-middle']
const bottomMidClass = styles['bottom-middle']

type ResizersProps = {
    width: number,
    height: number,
    zoom: number
}
const Resizers: React.FC<ResizersProps> = ({ zoom, width, height }) => {
    const resizeComp = useEditStore((state) => state.resizeComp)
    const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.preventDefault()
        const pos = e.currentTarget.dataset.pos?.split('-')
        if (!pos) return
        console.log(pos)
        let startX = e.pageX
        let startY = e.pageY
        const handleMouseMove = (e: MouseEvent) => {
            const curX = e.pageX
            const curY = e.pageY
            const deltaX = (curX - startX) * 100 / zoom
            const deltaY = (curY - startY) * 100 / zoom

            startX = curX
            startY = curY
            const vector = {
                topDiff: 0,
                leftDiff: 0,
                widthDiff: 0,
                heightDiff: 0
            }

            vector.widthDiff = deltaX
            vector.heightDiff = deltaY

            if (pos.includes('top')) {
                vector.topDiff = deltaY
                vector.heightDiff = -deltaY
            }
            if (pos.includes('left')) {
                vector.leftDiff = deltaX
                vector.widthDiff = -deltaX
            }
            if (pos[1] === 'mid') {
                switch (pos[0]) {
                    case 'top':
                    case 'bottom':
                        vector.widthDiff = 0
                        break;
                    case 'left':
                    case 'right':
                        vector.heightDiff = 0
                        break;
                }
            }

            console.log(vector)
            resizeComp(vector)
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }
    return (
        <>
            <div
                className={classNames(resizerClass, topLeftClass)}
                data-pos="top-left"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, topMidClass)}
                data-pos="top-mid"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, topRightClass)}
                data-pos="top-right"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, leftMidClass)}
                data-pos="left-mid"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, rightMidClass)}
                data-pos="right-mid"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, bottomLeftClass)}
                data-pos="bottom-left"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, bottomMidClass)}
                data-pos="bottom-mid"
                onMouseDown={handleResize}
            ></div>
            <div
                className={classNames(resizerClass, bottomRightClass)}
                data-pos="bottom-right"
                onMouseDown={handleResize}
            ></div>
        </>
    )
}

export default Resizers;