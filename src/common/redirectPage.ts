import React from "react";
import { NavigateFunction, useNavigate } from "react-router"

export const redirectPage = (navigate: NavigateFunction, id: string | undefined, tag: string) => {
    if (tag && id) {
        navigate(`/${tag}`, {
            state: {
                id: id,
            }
        });
    }
    else if(tag){
        navigate(`/${tag}`);
    }
}