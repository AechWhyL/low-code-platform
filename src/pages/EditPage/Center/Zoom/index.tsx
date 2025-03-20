import React, { useCallback } from 'react'
import { Slider } from 'antd'
import styles from './index.module.scss'
import useZoomStore from '@/store/zoomStore'
const mainClass = styles['zoom-box']
const btnClass = styles['btn']

const Zoom: React.FC = () => {
    const setZoom = useZoomStore((state) => state.setZoom)
    const zoomIn = useZoomStore((state) => state.zoomIn)
    const zoomOut = useZoomStore((state) => state.zoomOut)
    const zoom = useZoomStore((state) => state.zoom)

    const handleSetZoom = useCallback((value: number) => {
        setZoom(value)
    }, [setZoom])

    const handleZoomOut = useCallback(() => {
        zoomOut()
    }, [zoomOut])

    const handleZoomIn = useCallback(() => {
        zoomIn()
    }, [zoomIn])
    return <div className={mainClass}>
        <span
            className={btnClass}
            style={{ left: 0, transform: 'translate(-100%,-50%)', cursor: 'zoom-out' }}
            onClick={() => handleZoomOut()}
        >-</span>
        <Slider
            defaultValue={100}
            max={150}
            value={zoom}
            onChange={handleSetZoom}
            tooltip={{ open: true, color: 'geekblue', formatter: (value) => `缩放:${value}%` }}
        />
        <span
            className={btnClass}
            style={{ right: 0, transform: 'translate(100%,-50%)',cursor:'zoom-in' }}
            onClick={() => handleZoomIn()}
        >+</span>
    </div>
}
export default Zoom