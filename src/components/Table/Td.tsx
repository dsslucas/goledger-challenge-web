import React from "react";
import { TableTdInterface } from "./Interface";

const TableTd: React.FC<TableTdInterface> = (props: TableTdInterface) => {
    return <td>{props.children}</td>
}

export default TableTd;