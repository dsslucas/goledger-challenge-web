import React from "react";
import { NavigateFunction, useNavigate } from "react-router"

export const redirectPage = (navigate: NavigateFunction, id: string, tag: string | undefined) => {
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