import React from "react";
import { CompTypes } from "@/store/editStore";
import type { IComp, CompStyle } from "@/store/editStore/types";
import styles from "./leftSider.module.scss";
import classNames from "classnames";
import useEditStore from "@/store/editStore";
import emojiUrl from "@/assets/imgs/emoji.jpg";
import garyUrl from "@/assets/imgs/gary.jpg";
import cityUrl from "@/assets/imgs/city.jpg";

const sideClass = styles['side-template']
const compsClass = styles['comps']
const compContainerClass = styles['comp-container']
const compClass = styles['comp']
const imgCompClass = styles['img-comp']
const compDraggingClass = styles['comp-dragging']

const defaultImgStyle: CompStyle = {
    display: 'block',
    maxWidth: '100%',
    width: 120,
    height: 120,
    top: 0,
    left: 0
}

const comps: IComp[] = [
    {
        type: CompTypes.IMG,
        value: emojiUrl,
        style: {
            ...defaultImgStyle
        }
    },
    {
        type: CompTypes.IMG,
        value: garyUrl,
        style: {
            ...defaultImgStyle,
        }
    },
    {
        type: CompTypes.IMG,
        value: cityUrl,
        style: {
            ...defaultImgStyle,
        }
    }
]

const ImgSider: React.FC = () => {
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
                            className={classNames(compContainerClass, imgCompClass)}
                            draggable
                            onDragStart={(e) => onCompDragStart(e, comp)}
                            onDragEnd={onCompDragEnd}
                            onClick={() => addComp({
                                ...comp
                            })}
                        >
                            <div className={compClass}>
                                <img src={comp.value} alt="图片组件" />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ImgSider;