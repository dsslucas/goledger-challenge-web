import React from "react";
import { DividerInterface } from "./Interface";

const Divider: React.FC<DividerInterface> = (props: DividerInterface) => {
    var className = "";
    if (props.flex) className += "flex ";
    if (props.itemsCenter) className += "items-center ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.justifyBetween) className += "justify-between ";
    if (props.widthOneHalf) className += `w-1/2 `;

    return <div className={className.trim()}>
        {props.children}
    </div>;
}

export default Divider;