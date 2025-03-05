import React from "react";
import styles from "./index.module.scss";
import useEditStore from "@/store/editStore";
const EditHeaderClass = styles['edit-header-container']
const EditHeaderItemClass = styles['edit-header-item']
const EditHeader: React.FC = () => {
    const clearCanvas = useEditStore((state) => state.clearCanvas)
    return (
        <div className={EditHeaderClass}>
            <div className={EditHeaderItemClass}>
                <span>查看列表</span>
            </div>
            <div className={EditHeaderItemClass}>
                <span>保存</span>
            </div>
            <div className={EditHeaderItemClass}>
                <span>上一步</span>
            </div>
            <div className={EditHeaderItemClass}>
                <span>下一步</span>
            </div>
            <div className={EditHeaderItemClass} onClick={clearCanvas}>
                <span>清空画布</span>
            </div>
        </div>
    )
}

export default EditHeader;
