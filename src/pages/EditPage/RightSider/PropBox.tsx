import React from "react";
import styles from "./index.module.scss";
const propBoxClass = styles['prop-box']
const titleClass = styles['prop-title']

type Props = {
    title: string
}
const PropBox: React.FC<React.PropsWithChildren<Props>> = ({ title, children }) => {
    return (
        <div className={propBoxClass}>
            <span className={titleClass}>{title}</span>
            <div>
                {children}
            </div>
        </div>
    )
}

export default PropBox;