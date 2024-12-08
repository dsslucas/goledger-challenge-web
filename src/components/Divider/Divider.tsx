import React from "react";
import { DividerInterface } from "./Interface";

const Divider: React.FC<DividerInterface> = (props: DividerInterface) => {
    var className = "";
    if (props.flex) className += "flex ";
    if (props.flexCol) className += "flex-col ";
    if (props.flexWrap) className += "flex-wrap ";
    if (props.flex1) className += "flex-1 ";
    if (props.itemsStart) className += "items-start ";
    if (props.itemsCenter) className += "items-center ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.justifyBetween) className += "justify-between ";
    if (props.justifyEnd) className += "justify-end ";
    if (props.widthOneHalf) className += `w-1/2 `;
    if (props.widthFull) className += "w-full ";
    if (props.widthOneFiveDesktop) className += "xl:w-1/5 ";
    if (props.widthOneSixDesktop) className += "xl:w-1/6 ";
    if (props.width12Percent) className += "w-[12%] "
    if (props.grid) className += "grid ";
    if (props.gridColsCategories) className += "xs:grid-cols-1 xl:grid-cols-5 ";
    if (props.gap2) className += "gap-2 ";
    if (props.gap3) className += "gap-3 ";
    if (props.gapX2) className += "gap-x-2 ";
    if (props.padding2) className += "p-2 ";
    if (props.paddingY2) className += "py-2 ";
    if (props.backgroundGray) className += "bg-gray-300 ";
    if (props.rounded) className += "rounded ";
    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.padding4) className += "p-4 ";
    if (props.heightFull) className += "h-full ";
    if (props.maxHeight52) className += "max-h-52 ";
    if (props.maxHeight80) className += "max-h-80 ";
    if (props.overflowHidden) className += "overflow-hidden ";
    if (props.overflowY) className += "overflow-y-auto ";
    if (props.overflowX) className += "overflow-x-hidden ";
    if (props.loadingAnimateDefault) className += "fixed inset-0 bg-gray-800 flex justify-center items-center z-[100] transition-transform duration-500 z-100 ";
    if (props.loadingOpen) className += "translate-y-0 ";
    if (props.loadingClose) className += "-translate-y-full ";
    if (props.animatePulse) className += "animate-pulse ";
    if (props.textWhite) className += "text-white ";
    if (props.textJustify) className += "text-justify ";

    return <div className={className.trim()}>
        {props.children}
    </div>;
}

export default Divider;