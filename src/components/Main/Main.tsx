import React from "react";
import { MainInterface } from "./Interface";

const Main: React.FC<MainInterface> = (props: MainInterface) => {
    var className: string = "";

    if(props.flex) className += `flex `;
    if(props.justifyContentCenter) className += `justify-center `;
    if(props.alignItemsCenter) className += `items-center `;
    if(props.backgroundColor) className += `bg-[${props.backgroundColor}] `;

    return <main className={className.trim()}>{props.children}</main>
}

export default Main;