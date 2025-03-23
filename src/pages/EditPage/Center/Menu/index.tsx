import React from "react";
import styles from "./index.module.scss";
import useEditStore, { copyComps, pasteComps } from "@/store/editStore";
import useZoomStore from "@/store/zoomStore";

const MenuClass = styles['menu']
const MenuItemClass = styles['menu-item']

type MenuProps = {
    left: number,
    top: number,
    onMenuItemClick: (e: React.MouseEvent) => void,
}

const Menu: React.FC<MenuProps> = ({ left, top, onMenuItemClick }) => {
    console.log('menu rendered', left, top)

    const selectedIndexs = useEditStore((state) => state.selectedIndexs)
    const updateComp = useEditStore((state) => state.updateComp)
    const updateSelected = useEditStore((state) => state.updateSelected)
    const setSelected = useEditStore((state) => state.setCompSelected)
    const canvas = useEditStore((state) => state.canvas)
    const deleteComps = useEditStore((state) => state.deleteComps)
    const zoom = useZoomStore((state) => state.zoom)

    const menuRef = React.useRef<HTMLDivElement | null>(null)

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        console.log('menu clicked, delegation')
        onMenuItemClick(e)
    }

    const handleLayerChange = (e: React.MouseEvent, change: number | 'top' | 'bottom') => {
        e.preventDefault()
        if (typeof change === 'number') {
            selectedIndexs.forEach((index) => {
                const comp = canvas.comps[index]
                let zIndex = comp.style.zIndex
                zIndex += change
                updateComp(index, undefined, { zIndex })
            })
        } else if (change === 'top') {
            const zIndex = canvas.comps.reduce((max, comp) => {
                return max.style.zIndex > comp.style.zIndex ? max : comp
            }).style.zIndex + 1
            console.log(zIndex)
            updateSelected(undefined, { zIndex })
        } else if (change === 'bottom') {
            const zIndex = canvas.comps.reduce((min, comp) => {
                return min.style.zIndex < comp.style.zIndex ? min : comp
            }).style.zIndex - 1
            updateSelected(undefined, { zIndex })
        }
    }

    const handleSelectAll = (e: React.MouseEvent) => {
        e.preventDefault()
        const indexs = Array.from({ length: canvas.comps.length }, (_, i) => i)
        setSelected(true, ...indexs)
    }

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        console.log('copy clicked')
        copyComps()
    }

    const handlePaste = (e: React.MouseEvent) => {
        e.preventDefault()
        const canvas = document.querySelector('#canvas')
        if (!canvas) {
            return
        }
        const canvasLeft = canvas.getBoundingClientRect().left + window.scrollX
        const canvasTop = canvas.getBoundingClientRect().top + window.scrollY
        const menuLeft = menuRef.current?.getBoundingClientRect().left
        const menuTop = menuRef.current?.getBoundingClientRect().top
        if (!menuLeft || !menuTop) {
            return
        }
        const left = (menuLeft - canvasLeft) * 100 / zoom
        const top = (menuTop - canvasTop) * 100 / zoom
        console.log('paste clicked')
        pasteComps({ left, top })
    }

    const handleDelComps = (e: React.MouseEvent) => {
        e.preventDefault()
        deleteComps(...Array.from(selectedIndexs))
        console.log('delete clicked')
    }

    return <div className={MenuClass} style={{ left, top }} ref={menuRef} onClick={handleMenuClick}>
        <div className={MenuItemClass} onClick={handleDelComps}>
            <span>删除</span>
        </div>
        <div className={MenuItemClass} onClick={handleSelectAll}>
            <span>全选</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => handleLayerChange(e, 'top')}>
            <span>置顶</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => handleLayerChange(e, 'bottom')}>
            <span>置底</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => handleLayerChange(e, 1)}>
            <span>上移一层</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => handleLayerChange(e, -1)}>
            <span>下移一层</span>
        </div>
        <div className={MenuItemClass} onClick={handleCopy}>
            <span>复制</span>
        </div>
        <div className={MenuItemClass} onClick={handlePaste}>
            <span>粘贴</span>
        </div>
    </div>
}

export default Menu;