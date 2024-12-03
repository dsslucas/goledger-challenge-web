import React from "react";
import { H2Interface } from "./Interface";

const H2: React.FC<H2Interface> = (props: H2Interface) => {
    var className: string = "";

    if (props.textXl) className += `text-xl `;

    return <h2 className={className.trim()}>{props.children}</h2>
}

export default H2;