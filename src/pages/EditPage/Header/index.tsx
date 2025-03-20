import React from "react";
import styles from "./index.module.scss";
import useEditStore from "@/store/editStore";
import { undoCanvas, redoCanvas } from "@/store/editStore";
const EditHeaderClass = styles['edit-header-container']
const EditHeaderItemClass = styles['edit-header-item']
const ShortcutClass = styles['shortcut']
const EditHeader: React.FC = () => {
    const clearCanvas = useEditStore((state) => state.clearCanvas)
    return (
        <div className={EditHeaderClass}>
            <div className={EditHeaderItemClass}>
                <span>查看列表</span>
            </div>
            <div className={EditHeaderItemClass}>
                <span>保存</span>
                <span className={ShortcutClass}>Ctrl + S</span>
            </div>
            <div className={EditHeaderItemClass} onClick={undoCanvas}>
                <span>上一步</span>
                <span className={ShortcutClass}>Ctrl + Z</span>
            </div>
            <div className={EditHeaderItemClass} onClick={redoCanvas}>
                <span>下一步</span>
                <span className={ShortcutClass}>Ctrl + Shift + Z</span>
            </div>
            <div className={EditHeaderItemClass} onClick={clearCanvas}>
                <span>清空画布</span>
            </div>
        </div>
    )
}

export default EditHeader;
