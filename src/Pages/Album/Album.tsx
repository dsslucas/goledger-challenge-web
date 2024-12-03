import React from "react";
import { AlbumPageInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";

const Album:React.FC<AlbumPageInterface> = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const id = location.state.id;

    if(id === undefined || id === null) navigation("/home");

    return <></>
}

export default Album;