import React from "react";
import { H1Interface } from "./Interface";

const H1: React.FC<H1Interface> = (props: H1Interface) => {
    var className: string = "";

    if (props.text2xl) className += `text-2xl `;
    if (props.text3xl) className += "text-3xl ";

    return <h1 className={className.trim()}>{props.children}</h1>
}

export default H1;