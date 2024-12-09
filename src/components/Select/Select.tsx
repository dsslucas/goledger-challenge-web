import React from "react";
import { Option, SelectInterface } from "./Interface";

const Select: React.FC<SelectInterface> = (props: SelectInterface) => {
    var className = "px-2 ";
    if (props.border) className += "border border-solid border-gray-400 ";
    if (props.rounded) className += "rounded ";
    if (props.backgroundTransparent) className += "bg-transparent ";

    return (
        <select
            id={props.id}
            name={props.name}
            className={className.trim()}
            value={props.value}
            onChange={props.onChange}
        >
            <option value="">Selecione...</option>
            {props.options?.map((option: Option, index: number) => {
                return <option key={index} value={option.value}>{option.label}</option>
            })}
        </select>
    );
};

export default Select;