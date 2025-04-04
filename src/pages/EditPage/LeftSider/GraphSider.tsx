import React from "react";
import { CompTypes } from "@/store/editStore";
import type { IComp, CompStyle } from "@/store/editStore/types";
import styles from "./leftSider.module.scss";
import classNames from "classnames";
import useEditStore from "@/store/editStore";

const sideClass = styles['side-template']
const compsClass = styles['comps']
const compContainerClass = styles['comp-container']
const compClass = styles['comp']
const graphCompClass = styles['graph-comp']
const compDraggingClass = styles['comp-dragging']

const defaultGraphStyle: CompStyle = {
    width: 120,
    height: 120,
    borderColor: "#62beff",
    backgroundColor: "#62beff",
    top: 0,
    left: 0,
    zIndex: 1,
}

const comps: IComp[] = [
    {
        type: CompTypes.GRAPH,
        value: '',
        style: {
            ...defaultGraphStyle
        }
    },
    {
        type: CompTypes.GRAPH,
        value: '',
        style: {
            ...defaultGraphStyle,
            backgroundColor: 'rgbr(0,0,0,0)',
            borderWidth: 2,
            borderStyle: 'solid'
        }
    },
    {
        type: CompTypes.GRAPH,
        value: '',
        style: {
            ...defaultGraphStyle,
            backgroundColor: 'rgb(255,0,0)',
            borderColor: 'rgb(255,0,0)'
        }
    },
    {
        type: CompTypes.GRAPH,
        value: '',
        style: {
            ...defaultGraphStyle,
            backgroundColor: 'rgb(0,0,0)',
            borderColor: 'rgb(0,0,0)',
            borderRadius: '50%',
        }
    }
]

const GraphSider: React.FC = () => {
    const addComp = useEditStore((state) => state.addComp)
    const onCompDragStart = (e: React.DragEvent<HTMLElement>, data: {
        type: number,
        value?: string,
        style?: React.CSSProperties
    }) => {
        e.dataTransfer.setData('drag-comp', JSON.stringify(data))
        e.currentTarget.classList.add(compDraggingClass)
    }
    const onCompDragEnd = (e: React.DragEvent<HTMLElement>) => {
        e.currentTarget.classList.remove(compDraggingClass)
    }
    return (
        <div className={sideClass}>
            <ul className={compsClass}>
                {comps.map((comp, index) => {
                    return (
                        <li
                            key={index}
                            className={classNames(compContainerClass, graphCompClass)}
                            draggable
                            onDragStart={(e) => onCompDragStart(e, comp)}
                            onDragEnd={onCompDragEnd}
                            onClick={() => addComp({
                                ...comp
                            })}
                            style={
                                {
                                    backgroundColor: comp.style.backgroundColor,
                                    borderColor: comp.style.borderColor,
                                    borderRadius: comp.style.borderRadius,
                                }
                            }
                        >
                            <div className={compClass}>
                                {comp.value}
                            </div>
                            
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default GraphSider;