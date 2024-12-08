import React from "react";
import { SpanInterface } from "./Interface";

const Span: React.FC<SpanInterface> = (props: SpanInterface) => {
    var className = "";
    
    if (props.details) className += "text-sm text-gray-500 ";
    if (props.indicator) className += "px-2 bg-gray-600 text-white rounded text-sm"

    return <span className={className.trim()}>{props.children}</span>
}

export default Span;