import React from "react";
import { ImageInterface } from "./Interface";

const Image: React.FC<ImageInterface> = (props: ImageInterface) => {
    var className = "";

    if (props.widthFull) className += "w-full ";
    if (props.roundedT) className += "rounded-t ";
    if (props.roundedTMobile) className += "xs:rounded-t ";
    if (props.roundedTlTablet) className += "md:rounded-t-none md:rounded-tl ";
    if (props.roundedTDesktop) className += "xl:rounded-t ";
    if (props.roundedBlTablet) className += "md:rounded-bl lg:rounded-bl-none"

    return <img className={className.trim()} src={props.src} alt={props.alt}/>
}

export default Image;