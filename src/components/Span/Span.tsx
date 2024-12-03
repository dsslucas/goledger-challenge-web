import React from "react";
import { SpanInterface } from "./Interface";

const Span: React.FC<SpanInterface> = (props: SpanInterface) => {
    var className = "";
    
    if (props.details) className += "text-sm text-gray-500 ";

    return <span className={className.trim()}>{props.children}</span>
}

export default Span;