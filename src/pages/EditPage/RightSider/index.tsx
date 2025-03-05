import React from "react";
import styles from "./index.module.scss";

const mainClass = styles['right-sider']
const RightSider: React.FC = () => {

    return (
        <div className={mainClass}>
            RightSider
        </div>
    )
}

export default RightSider;