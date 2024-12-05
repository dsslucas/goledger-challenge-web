import React from "react";
import { ButtonInterface } from "./Interface";

const Button: React.FC<ButtonInterface> = (props: ButtonInterface) => {
    var className = "";
    if (props.flex) className += "flex ";
    if (props.flexColumn) className += "flex-col ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.itemsCenter) className += "items-center ";
    if (props.active) className += "";
    if (props.width25Percent) className += "w-1/4 ";
    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.borderColorHover) className += "hover:border-gray-500 ";
    if (props.rounded) className += "rounded ";
    if (props.roundedB) className += "rounded-b ";
    if (props.padding2) className += "p-2 ";
    if (props.paddingX2) className += "px-2 ";
    if (props.backgroundColor) className += `bg-${props.backgroundColor} hover:opacity-75 `;
    if (props.successBackgroundColor) className += "bg-success hover:opacity-75 ";
    if (props.editBackgroundColor) className += "bg-edit hover:opacity-75 ";
    if (props.infoBackgroundColor) className += "bg-info hover:opacity-75 ";
    if (props.deleteBackgroundColor) className += "bg-delete hover:opacity-75 ";
    if (props.textWhite) className += `text-white `;
    if (props.uppercase) className += `uppercase `;
    if (props.icon) className += "w-7 h-7 ";
    if (props.gapX2) className += "gap-x-2 ";


    return <button type={props.type} className={className.trim()} onClick={props.onClick} key={props.key}>
        {props.children}
    </button>
}

export default Button;