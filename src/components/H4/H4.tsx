import React from "react";
import { H4Interface } from "./Interface";

const H4: React.FC<H4Interface> = (props: H4Interface) => {
    return <h4>{props.children}</h4>
}

export default H4;