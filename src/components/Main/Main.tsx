import React from "react";
import { MainInterface } from "./Interface";

const Main: React.FC<MainInterface> = (props: MainInterface) => {
    var className: string = "min-h-[calc(100vh-4rem)] ";

    if (props.flex) className += `flex `;
    if (props.flexColumn) className += `flex-col `;
    if (props.justifyCenter) className += `justify-center `;
    if (props.justifyBetween) className += `justify-between `;
    if (props.alignItemsCenter) className += `items-center `;
    if (props.backgroundColor) className += `bg-[${props.backgroundColor}] `;
    if (props.gap2) className += "gap-2 ";
    if (props.paddingX10) className += "xl:px-10 ";
    if (props.paddingX5Mobile) className += "xs:px-5 ";
    if (props.paddingBottomMobile) className += "xs:pb-2 "

    return <main className={className.trim()}>{props.children}</main>
}

export default Main;