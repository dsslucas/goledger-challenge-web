import React from "react";
import { FieldsetInterface } from "./Interface";

const Fieldset: React.FC<FieldsetInterface> = (props: FieldsetInterface) => {
    var className = "";

    if (props.flex) className += "flex ";
    if (props.flexColumn) className += "flex-col ";
    if (props.itemsCenter) className += "items-center ";
    if (props.gapX2) className += "gap-x-2 ";
    if (props.height7) className += "h-7 ";

    return <fieldset className={className.trim()}>{props.children}</fieldset>
}

export default Fieldset;