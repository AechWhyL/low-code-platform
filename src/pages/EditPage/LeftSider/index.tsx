import React, { useEffect, useState } from "react";
import classNames from 'classnames'
import styles from "./index.module.scss";
import TextSider from "./TextSider";
import GraphSider from "./GraphSider";
import ImgSider from "./ImgSider";
const menuItems: {
    title: string,
}[] = [
        {
            title: '文本',
        },
        {
            title: '图片',
        },
        {
            title: '图形',
        }
    ]
const activeMenuItemClass = styles['menu-item-selected']
const baseMenuItemClass = styles['menu-item']

const LeftSider: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
    const onMenuItemClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
        setActiveIndex(index === activeIndex ? undefined : index)
    }
    const isTextCompsShow = () => {
        return activeIndex === 0
    }
    const isGraphCompsShow = () => {
        return activeIndex === 2
    }
    const isImgCompsShow = () => {
        return activeIndex === 1
    }
    useEffect(() => {
        const handler = () => {
            setActiveIndex(undefined)
        }
        const canvasArea = document.querySelector('#canvas-area')
        canvasArea?.addEventListener('click', handler)
        return () => {
            canvasArea?.removeEventListener('click', handler)
        }
    }, [])
    return (
        <>
            <div className={styles['left-sider']}>
                <ul className={styles['menu']}>
                    {menuItems.map((item, index) => {
                        return (
                            <li key={index} className={classNames(baseMenuItemClass, {
                                [activeMenuItemClass]: activeIndex === index,
                            })} onClick={(event) => onMenuItemClick(event, index)}>
                                {item.title}
                            </li>
                        )
                    })}
                </ul>
                {isTextCompsShow() && <TextSider />}
                {isGraphCompsShow() && <GraphSider />}
                {isImgCompsShow() && <ImgSider />}
            </div>
        </>
    )
}

export default LeftSider;