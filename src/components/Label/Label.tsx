import React from "react";
import { LabelInterface } from "./Interface";

const Label: React.FC<LabelInterface> = (props: LabelInterface) => {
    return <label htmlFor={props.for}>{props.children}</label>
}

export default Label;