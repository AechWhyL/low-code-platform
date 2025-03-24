import React, { useEffect } from "react";
import styles from "./index.module.scss";
import useEditStore, { copyComps, pasteComps, layerUp, layerDown, layerTop, layerBottom } from "@/store/editStore";
import useZoomStore from "@/store/zoomStore";

const MenuClass = styles['menu']
const MenuItemClass = styles['menu-item']
const titleClass = styles['title']
const shortcutClass = styles['shortcut']

type MenuProps = {
    left: number,
    top: number,
    visible: boolean,
    onMenuItemClick: (e: React.MouseEvent) => void,
}

const Menu: React.FC<MenuProps> = ({ left, top, onMenuItemClick, visible }) => {
    console.log('menu rendered', left, top)

    const selectedIndexs = useEditStore((state) => state.selectedIndexs)
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

    const handleSelectAll = () => {
        const indexs = Array.from({ length: canvas.comps.length }, (_, i) => i)
        setSelected(true, ...indexs)
    }

    const handleCopy = () => {
        console.log('copy clicked')
        copyComps()
    }

    const handlePaste = () => {
        const canvas = document.querySelector('#canvas')
        if (!canvas) {
            console.log('canvas not found')
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

    const handleDelComps = () => {
        deleteComps(...Array.from(selectedIndexs))
        console.log('delete clicked')
    }

    const menuStyle: React.CSSProperties = {
        left,
        top,
    }
    if (!visible) {
        menuStyle.display = 'none'
    }

    useEffect(() => {
        console.log('menu mounted')
        const handleShortcut = (e: KeyboardEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.code === "Backspace") {
                handleDelComps()
                return
            }
            if (e.metaKey || e.ctrlKey) {
                switch (e.code) {
                    case "KeyC":
                        handleCopy()
                        break;
                    case "KeyA":
                        handleSelectAll()
                        break;
                    case "KeyV":
                        pasteComps()
                        break;
                    case "ArrowUp":
                        layerUp()
                        break;
                    case "ArrowDown":
                        layerDown()
                        break;
                }
            }
        }
        const canvasArea = document.querySelector('#canvas-area') as HTMLElement
        console.log(canvasArea)
        canvasArea?.addEventListener('keydown', handleShortcut)
        return () => {
            console.log('menu unmounted')
            canvasArea?.removeEventListener('keydown', handleShortcut)
        }
    })

    return <div className={MenuClass} style={menuStyle} ref={menuRef} onClick={handleMenuClick}>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); handleCopy() }}>
            <span className={titleClass}>复制</span>
            <span className={shortcutClass}>Ctrl + C</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); handlePaste() }}>
            <span className={titleClass}>粘贴</span>
            <span className={shortcutClass}>Ctrl + V</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); handleDelComps() }}>
            <span className={titleClass}>删除</span>
            <span className={shortcutClass}>Backspace</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); handleSelectAll() }}>
            <span className={titleClass}>全选</span>
            <span className={shortcutClass}>Ctrl + A</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); layerTop() }}>
            <span className={titleClass}>置顶</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); e.preventDefault(); layerBottom() }}>
            <span className={titleClass}>置底</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); layerUp() }}>
            <span className={titleClass}>上移一层</span>
            <span className={shortcutClass}>CTRL + ↑</span>
        </div>
        <div className={MenuItemClass} onClick={(e) => { e.preventDefault(); layerDown() }}>
            <span className={titleClass}>下移一层</span>
            <span className={shortcutClass}>CTRL + ↓</span>
        </div>
    </div>
}

export default Menu;