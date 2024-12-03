import React from "react";
import { ImageInterface } from "./Interface";

const Image: React.FC<ImageInterface> = (props: ImageInterface) => {
    var className = "";

    if (props.widthFull) className += "w-full ";
    if (props.roundedT) className += "rounded-t ";

    return <img className={className.trim()} src={props.src}/>
}

export default Image;