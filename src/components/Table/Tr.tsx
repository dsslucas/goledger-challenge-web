import React from "react";
import { TableTrInterface } from "./Interface";

const TableTr: React.FC<TableTrInterface> = (props: TableTrInterface) => {
    var className:string = "";

    if (props.backgroundStripedGray) className += "even:bg-gray-500 even:bg-opacity-30"

    return <tr data-key={props.rowKey} className={className.trim()}>{props.children}</tr>
}

export default TableTr;