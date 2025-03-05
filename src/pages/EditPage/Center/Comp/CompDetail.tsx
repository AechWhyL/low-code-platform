import React from "react";
import type { IComp } from "@/store/editStore/types";

export const TextComp: React.FC<IComp> = (props: IComp) => {
    return (
        <span style={props.style}>{props.value}</span>
    )
}

export const GraphComp: React.FC<IComp> = (props: IComp) => {
    return (
        <div style={props.style}></div>
    )
}

export const ImgComp: React.FC<IComp> = (props: IComp) => {
    return (
        <img src={props.value} style={props.style} alt="图片组件" />
    )
}