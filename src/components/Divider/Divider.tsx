import React from "react";
import { DividerInterface } from "./Interface";

const Divider: React.FC<DividerInterface> = (props: DividerInterface) => {
    var className = "";
    if (props.flex) className += "flex ";
    if (props.flexWrap) className += "flex-wrap ";
    if (props.itemsCenter) className += "items-center ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.justifyBetween) className += "justify-between ";
    if (props.widthOneHalf) className += `w-1/2 `;
    if (props.widthFull) className += "w-full ";
    if (props.grid) className += "grid ";
    if (props.gridColsCategories) className += "xs:grid-cols-1 xl:grid-cols-5 ";
    if (props.gap3) className += "gap-3 ";
    if (props.gapX2) className += "gap-x-2 ";
    if (props.padding2) className += "p-2 ";

    return <div className={className.trim()}>
        {props.children}
    </div>;
}

export default Divider;