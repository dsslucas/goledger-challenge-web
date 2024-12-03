import React from "react";
import { PlaylistInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";

const Playlist:React.FC<PlaylistInterface> = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const id = location.state.id;

    if(id === undefined || id === null) navigation("/home");
    return <></>
}

export default Playlist;