import React, { useEffect, useState } from "react";
import { ArtistPageInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";
import Section from "../../components/Section/Section";
import H1 from "../../components/H1/H1";
import getArtist from "../../api/artists";
import Banjo from "../../assets/img/banjo.jpg";
import Figure from "../../components/Figure/Figure";
import Image from "../../components/Image/Image";

const Artist: React.FC<ArtistPageInterface> = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const id = location.state.id;

    if (id === undefined || id === null) navigation("/home");

    const [data, setData] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getArtist().getArtistInfo(id);
            console.log("DADOS VINDOS DA API: ", data);
            setData(data);
        }

        fetchData();
    }, []);

    return <>
        <Section flex justifyCenter paddingY2>
            <Figure flex justifyCenter itemsCenter>
                <Image src={Banjo} widthFull roundedT />
            </Figure>
            <H1>Artista XXXXXXX</H1>
        </Section>
    </>
}

export default Artist;