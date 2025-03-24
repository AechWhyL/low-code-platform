import React, { useCallback } from "react";
import { Input, InputNumber, Select } from "antd";
import PropBox from "./PropBox";
import useEditStore from "@/store/editStore";
import { ColorPicker, ColorPickerProps } from 'antd';
import type { CompStyle, IComp } from "@/store/editStore/types";
import type { GetProp } from "antd";
import { throttle } from "lodash-es";
import type { AggregationColor } from "antd/es/color-picker/color";

type Props = {
    comp: IComp
}
type ColorOnChange = GetProp<ColorPickerProps, 'onChange'>;

const CompEditor: React.FC<Props> = ({ comp }) => {
    const { style } = comp
    const updateSelected = useEditStore((state) => state.updateSelected)
    const handleCompStyleChange = useCallback(<T extends keyof (React.CSSProperties)>(value: number | string | null, prop: T) => {
        if (!value) return
        const newStyle: Partial<CompStyle> = {}
        switch (prop) {
            case 'width':
            case 'height':
            case 'left':
            case 'top':
            case 'fontSize':
            case 'zIndex':
                value = Number(value)
                break
            case 'backgroundColor':
                value = value.toString()
                break
            case 'borderRadius':
                value = value.toString() + '%'
                break

        }
        newStyle[prop] = value as CompStyle[T]
        updateSelected(undefined, newStyle)

    }, [updateSelected])

    const handleColorPick: ColorOnChange = throttle((color) => {
        updateSelected(undefined, { backgroundColor: color.toHexString() })
    }, 50)

    const handleCompPropChange = <T extends keyof Omit<IComp, 'style' | 'type'>>(propKey: T, value: IComp[T]) => {
        if (value !== undefined && value !== null) {
            updateSelected({ [propKey]: value })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                width: '100%',
                height: '100%',
                padding: '10px 20px',
                gap: '10px',
            }}
        >
            <span style={{ width: '100%', fontSize: '1.5em', textAlign: 'left', fontWeight: 'bold' }}>组件属性</span>
            <PropBox title="组件名称">
                <Input value={comp.name} onChange={(e) => handleCompPropChange('name', e.currentTarget.value)} />
            </PropBox>
            <PropBox title="值">
                <Input value={comp.value} onChange={(e) => handleCompPropChange('value', e.currentTarget.value)} />
            </PropBox>
            <PropBox title="宽度">
                <InputNumber
                    stringMode
                    step={0.5}
                    value={style.width}
                    style={{ width: '100%' }}
                    min={0}
                    onChange={(value) => handleCompStyleChange(value, 'width')} />
            </PropBox>
            <PropBox title="高度">
                <InputNumber
                    stringMode
                    step={0.5}
                    style={{ width: '100%' }}
                    value={style.height}
                    onChange={(value) => handleCompStyleChange(value, 'height')} />
            </PropBox>
            {style.fontSize && <PropBox title="字体大小:">
                <InputNumber
                    value={style.fontSize}
                    style={{ width: '100%' }}
                    onChange={(value) => handleCompStyleChange(value, 'fontSize')} />
            </PropBox>}
            {style.borderRadius && <PropBox title="圆角:">
                <InputNumber
                    value={parseInt(style.borderRadius as string) || '0'}
                    suffix={'%'}
                    style={{ width: '100%' }}
                    min={0}
                    max={50}
                    onChange={(value) => handleCompStyleChange(value, 'borderRadius')} />
            </PropBox>}
            <PropBox title="对齐方式">
                <Select style={{ width: '100%' }} defaultValue={comp.style.textAlign} onChange={(value) => handleCompStyleChange(value, 'textAlign')}>
                    <Select.Option value="left">左对齐</Select.Option>
                    <Select.Option value="center">居中</Select.Option>
                    <Select.Option value="right">右对齐</Select.Option>
                </Select>
            </PropBox>
            <PropBox title="位置">
                <PropBox title="x">
                    <InputNumber
                        stringMode
                        value={style.left.toFixed(2)}
                        style={{ width: '100%' }}
                        step={0.5}
                        onChange={(value) => handleCompStyleChange(value, 'left')} />
                </PropBox>
                <PropBox title="y">
                    <InputNumber
                        stringMode
                        step={0.5}
                        value={style.top.toFixed(2)}
                        onChange={(value) => handleCompStyleChange(value, 'top')} />
                </PropBox>
            </PropBox>
            <PropBox title="背景颜色:">
                <ColorPicker
                    value={style.backgroundColor?.toString()}
                    onChange={handleColorPick}
                    style={{ width: '100%' }}
                    showText={(color: AggregationColor) => (<span style={{ color: '#000', fontSize: '1.1em' }}> {color.toHexString()}</span>)}
                />
            </PropBox>
        </div >
    )
}

export default CompEditor;