import React from "react";
import { TableHeaderInterface } from "./Interface";

const Thead: React.FC<TableHeaderInterface> = (props: TableHeaderInterface) => {
    var className:string = "";

    if (props.top0) className += "top-0 ";
    if (props.sticky) className += "sticky ";
    if (props.backgroundGray) className += "bg-gray-600 ";
    if (props.textWhite) className += "text-white ";

    return <thead className={className.trim()}>{props.children}</thead>
}

export default Thead;