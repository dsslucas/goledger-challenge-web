import React from "react";
import { LoadingInterface } from "./Interface";
import Divider from "../Divider/Divider";
import Span from "../Span/Span";

const Loading: React.FC<LoadingInterface> = ({ open }: LoadingInterface) => {
    const rootElement = document.getElementById('root') as HTMLElement;

    if(open) rootElement.style.overflow = 'hidden';
    else rootElement.style.overflow = 'auto';    

    return (
        <Divider loadingAnimateDefault loadingOpen={open} loadingClose={!open}>
            <Divider textWhite animatePulse>
                <Span>Loading...</Span>
            </Divider>
        </Divider>
    );
}

export default Loading;
