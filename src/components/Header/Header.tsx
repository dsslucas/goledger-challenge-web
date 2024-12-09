import React from "react";
import { HeaderInterface } from "./Interface";

const Header: React.FC<HeaderInterface> = (props: HeaderInterface) => {
    var className: string = "";

    if(props.backgroundColor) className += `bg-[${props.backgroundColor}] `;
    if(props.height16) className += `h-16 `;
    if(props.zIndex10) className += `z-10 `;
    if(props.flex) className += `flex `;
    if(props.justifyContentCenter) className += `justify-center `;
    if(props.alignItemsCenter) className += `items-center `;
    if(props.textWhite) className += "text-white ";

    return <header className={className.trim()}>{props.children}</header>
}

export default Header;