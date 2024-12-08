import React from "react";
import { InputInterface } from "./Interface";

const Input: React.FC<InputInterface> = (props: InputInterface) => {
    var className = "px-2 ";

    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.rounded) className += "rounded ";
    if (props.backgroundTransparent) className += "bg-transparent ";
    if (props.width36) className += "w-36 ";
    if (props.widthFull) className += "w-full ";
    
    return <input
        id={props.id}
        name={props.name}
        type={props.type}
        value={props.value}
        required={props.required}
        checked={props.checked}
        className={className.trim()}
        onChange={props.onChange}
    />
}

export default Input;