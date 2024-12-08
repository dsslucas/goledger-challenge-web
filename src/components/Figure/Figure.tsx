import React from "react";
import { FigureInterface } from "./Interface";

const Figure: React.FC<FigureInterface> = (props: FigureInterface) => {
    var className = "";

    if (props.flex) className += "flex ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.itemsCenter) className += "items-center ";
    if (props.widthOneSixDesktop) className += "xl:w-24 ";
    if (props.widthFullMobile) className += "xs:w-full ";
    if (props.width50PercentTablet) className += "md:w-[50%] ";
    if (props.widthFullDesktop) className += "xl:w-full ";

    return <figure className={className.trim()}>
        {props.children}
    </figure>
}

export default Figure;