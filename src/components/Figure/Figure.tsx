import React from "react";
import { FigureInterface } from "./Interface";

const Figure: React.FC<FigureInterface> = (props: FigureInterface) => {
    var className = "";

    if (props.flex) className += "flex ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.itemsCenter) className += "items-center ";

    return <figure className={className.trim()}>
        {props.children}
    </figure>
}

export default Figure;