import React from "react";
import { TableThInterface } from "./Interface";

const TableTh: React.FC<TableThInterface> = (props: TableThInterface) => {
    return <th>{props.children}</th>
}

export default TableTh;