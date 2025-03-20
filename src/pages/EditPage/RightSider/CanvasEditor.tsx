import React from "react";
import PropBox from "./PropBox";
import type { CanvasStyle } from "@/store/editStore/types";
import { ColorPicker, Input, InputNumber } from "antd";
import useEditStore from "@/store/editStore";

const CanvasEditor: React.FC = () => {
    const canvas = useEditStore((state) => state.canvas)
    const { style } = canvas
    const updateCanvas = useEditStore((state) => state.updateCanvas)
    const handleCanvasPropChange = <T extends keyof CanvasStyle>(title?: string, style?: Record<T, CanvasStyle[T]>) => {
        updateCanvas(title, style)
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
            height: '100%',
            padding: '10px 20px',
            gap: '10px',
        }}>
            <span style={{ width: '100%', fontSize: '1.5em', textAlign: 'left', fontWeight: 'bold' }}>画布属性</span>
            <PropBox title="画布标题：">
                <Input value={canvas.title} onChange={(e) => handleCanvasPropChange(e.currentTarget.value)} />
            </PropBox>
            <PropBox title="画布样式：">
                <PropBox title="宽度：(px)">
                    <InputNumber
                        style={{ width: '100%' }}
                        value={style.width}
                        step={0.5}
                        onChange={(value) => handleCanvasPropChange(undefined, { width: Number(value) })}
                    />
                </PropBox>
                <PropBox title="高度：(px)">
                    <InputNumber
                        style={{ width: '100%' }}
                        value={style.height}
                        step={0.5}
                        onChange={(value) => handleCanvasPropChange(undefined, { height: Number(value) })}
                    />
                </PropBox>
            </PropBox>
            <PropBox title="画布背景：">
                <ColorPicker
                    value={style.backgroundColor?.toString()}
                    style={{ width: '100%' }}
                    onChange={(color) => handleCanvasPropChange(undefined, { backgroundColor: color.toHexString() })}
                    showText={(color) => <span style={{ color: '#000',fontSize:'1.2em' }}>{color.toHexString()}</span>}
                />
            </PropBox>
        </div>
    )
}

export default CanvasEditor;