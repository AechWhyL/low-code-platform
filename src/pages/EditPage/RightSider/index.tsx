import React, { useState } from "react";
import styles from "./index.module.scss";
import useEditStore from "@/store/editStore";
import CompEditor from "./CompEditor";
import CompsEditor from "./CompsEditor";
import CanvasEditor from "./CanvasEditor";
import classNames from "classnames";
const mainClass = styles['right-sider']
const closeBtnClass = styles['close-btn']
const mainHiddenClass = styles['hidden']
const RightSider: React.FC = () => {
    const canvas = useEditStore((state) => state.canvas)
    const selectedIndexs = useEditStore((state) => state.selectedIndexs)
    const selectedCount = selectedIndexs.size
    const [isVisible, setIsVisible] = useState(true)
    return (
        <div className={classNames(mainClass,
            {
                [mainHiddenClass]: !isVisible
            }
        )}>
            {
                (() => {
                    switch (selectedCount) {
                        case 1:
                            const comp = canvas.comps[Array.from(selectedIndexs)[0]]
                            return <CompEditor comp={comp} />
                        case 0:
                            return <CanvasEditor />
                        default:
                            return <CompsEditor />
                    }
                })()
            }
            <span className={closeBtnClass} onClick={() => setIsVisible(!isVisible)}>X</span>
        </div>
    )
}

export default RightSider;