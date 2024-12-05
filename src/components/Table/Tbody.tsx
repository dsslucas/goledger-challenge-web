import React from "react";
import { TableBodyInterface } from "./Interface";

const Tbody: React.FC<TableBodyInterface> = (props: TableBodyInterface) => {
    var className:string = "";
    

    return <tbody>{props.children}</tbody>
}

export default Tbody;