import React from "react";
import type { ICompWithKey } from "@/store/editStore/types";
import styles from "./index.module.scss"
import { pick, omit } from "lodash-es"
import useEditStore, { CompTypes } from "@/store/editStore";
import { GraphComp, TextComp, ImgComp } from "./CompDetail";
import classNames from "classnames";

const mainClass = styles['main']
const innerClass = styles['inner']
const selectedClass = styles['outer-selected']
type CompProps = {
    isSelected: boolean,
    comp: ICompWithKey,
    index: number,
}
const Comp: React.FC<React.PropsWithChildren<CompProps>> = (props) => {
    const setCompSelected = useEditStore((state) => state.setCompSelected)
    const { comp, index, isSelected } = props
    const compKey = comp.key
    const compWithoutKey = omit(comp, ["key"])
    const outerStyle = pick(comp.style, ["width", "height", "left", "top", "position"])
    const innerStyle = omit(comp.style, ["width", "height", "left", "top", "position"])
    const handleCompClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (e.metaKey || e.ctrlKey) {
            setCompSelected(false, index)
        } else {
            setCompSelected(true, index)
        }
    }
    console.log("Comp rendered:", compKey)
    return (
        <div
            className={classNames(mainClass, isSelected && selectedClass)}
            style={{ zIndex: index, ...outerStyle }}
            onClick={handleCompClick}
        >
            <div className={innerClass} style={{ ...innerStyle }} >
                {comp.type === CompTypes.TEXT && <TextComp {...compWithoutKey} />}
                {comp.type === CompTypes.GRAPH && <GraphComp {...compWithoutKey} />}
                {comp.type === CompTypes.IMG && <ImgComp {...compWithoutKey} />}
            </div>
        </div>
    )
}
const MemoComp = React.memo(Comp)
export default MemoComp