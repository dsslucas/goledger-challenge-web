import React from "react";
import { TableInterface } from "./Interface";

const Table: React.FC<TableInterface> = (props: TableInterface) => {
    var className:string = "";
    
    if (props.textCenter) className += "text-center ";
    if (props.widthFull) className += "w-full ";

    return <table className={className.trim()}>{props.children}</table>
}

export default Table;