import React from "react";
import styles from "./leftSider.module.scss";
import useEditStore from "@/store/editStore";
import { CompTypes } from "@/store/editStore";
import type { CompStyle } from "@/store/editStore/types";

const defaultTextCompStyle: CompStyle = {
    width: 170,
    height: 30,
    lineHeight: '30px',
    textAlign: 'left',
    fontSize: 'normal',
    textDecoration: 'none',
    wordSpacing: '10px',
    top: 0,
    left: 0
}
const SideClass = styles['side-template']
const compsClass = styles['comps']
const compClass = styles['comp']
const compDraggingClass = styles['comp-dragging']
const comps: {
    name: string,
    value: string,
    style: CompStyle
}[] = [
        {
            name: '标题',
            value: '双击编辑标题',
            style: {
                ...defaultTextCompStyle,
                fontSize: 20,
                height: 50,
                lineHeight: '50px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#000',
            }
        },
        {
            name: "正文",
            value: "双击编辑正文",
            style: {
                ...defaultTextCompStyle,
                fontSize: "16px",
                fontWeight: "normal",
                color: "#000",
            }
        },
    ]
const TextSide: React.FC = ({ }) => {
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
        <div className={SideClass}>
            <ul className={compsClass}>
                {comps.map((comp, index) => {
                    return (
                        <li
                            key={index}
                            className={compClass}
                            draggable
                            onDragStart={(e) => onCompDragStart(e, {
                                type: 1,
                                value: comp.value,
                                style: comp.style,
                            })}
                            onDragEnd={(e) => onCompDragEnd(e)}
                            onClick={() => addComp({
                                type: CompTypes.TEXT,
                                value: comp.value,
                                style: comp.style,
                            })}>{comp.name}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TextSide;