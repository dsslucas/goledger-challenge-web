import React from "react";
import { ButtonInterface } from "./Interface";

const Button: React.FC<ButtonInterface> = (props: ButtonInterface) => {
    var className = "";

    if (props.active) className += "";
    if (props.width25Percent) className += "w-1/4 ";
    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.borderColorHover) className += "hover:border-gray-500 ";
    if (props.rounded) className += "rounded ";
    if (props.paddingX2) className += "px-2 ";

    if (props.backgroundColor) className += `bg-[${props.backgroundColor}] `;
    if (props.textWhite) className += `text-white `;
    if (props.uppercase) className += `uppercase `;

    return <button className={className.trim()} key={props.key}>
        {props.children}
    </button>
}

export default Button;