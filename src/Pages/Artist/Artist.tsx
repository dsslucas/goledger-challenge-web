import React from "react";
import { ArtistPageInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";


const Artist:React.FC<ArtistPageInterface> = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const id = location.state.id;

    if(id === undefined || id === null) navigation("/home");

    return <h1>opa joia</h1>
}

export default Artist;