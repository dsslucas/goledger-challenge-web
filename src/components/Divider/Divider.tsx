import React from "react";
import { DividerInterface } from "./Interface";

const Divider: React.FC<DividerInterface> = (props: DividerInterface) => {
    var className = "";
    if (props.flex) className += "flex ";
    if (props.flexCol) className += "flex-col ";
    if (props.flexWrap) className += "flex-wrap ";
    if (props.itemsCenter) className += "items-center ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.justifyBetween) className += "justify-between ";

    if (props.widthOneHalf) className += `w-1/2 `;
    if (props.widthFull) className += "w-full ";
    if (props.widthOneFiveDesktop) className += "xl:w-1/5 ";
    if (props.widthOneSixDesktop) className += "xl:w-1/6 ";
    if (props.grid) className += "grid ";
    if (props.gridColsCategories) className += "xs:grid-cols-1 xl:grid-cols-5 ";
    if (props.gap2) className += "gap-2 ";
    if (props.gap3) className += "gap-3 ";
    if (props.gapX2) className += "gap-x-2 ";
    if (props.padding2) className += "p-2 ";
    if (props.paddingY2) className += "py-2 ";
    if (props.backgroundGray) className += "bg-gray-300 ";
    if (props.rounded) className += "rounded " ;
    if (props.border) className += "border border-solid border-gray-400 ";

    return <div className={className.trim()}>
        {props.children}
    </div>;
}

export default Divider;