import React from "react";
import { AsideInterface } from "./Interface";

const Aside: React.FC<AsideInterface> = (props: AsideInterface) => {
    var className: string = "";

    if (props.flex) className += `flex `;
    if (props.flex1) className += `flex-1 `;
    if (props.flexColumn) className += `flex-col `;
    if (props.widthFull) className += "w-full ";

    return <aside className={className.trim()}>{props.children}</aside>
}

export default Aside;