import React from "react";
import { DividerInterface } from "./Interface";

const Divider: React.FC<DividerInterface> = (props: DividerInterface) => {
    return <div>
        {props.children}
    </div>;
}

export default Divider;