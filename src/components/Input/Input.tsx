import React from "react";
import { InputInterface } from "./Interface";

const Input: React.FC<InputInterface> = (props: InputInterface) => {
    var className = "";

    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.rounded) className += "rounded ";
    if (props.backgroundTransparent) className += "bg-transparent ";

    return <input
        type={props.type}
        value={props.value}
        className={className.trim()}
        onChange={props.onChange}
    />
}

export default Input;