import React, { useEffect, useState } from "react";
import { ArtistPageInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";
import Section from "../../components/Section/Section";
import H1 from "../../components/H1/H1";
import getArtist from "../../api/artists";
import Banjo from "../../assets/img/banjo.jpg";
import Figure from "../../components/Figure/Figure";
import Image from "../../components/Image/Image";
import Fieldset from "../../components/Fieldset/Fieldset";
import Span from "../../components/Span/Span";
import H2 from "../../components/H2/H2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Divider from "../../components/Divider/Divider";

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

    const handleChangeArtistLocation = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        console.log("CLiquei na alteracao");
    }

    const handleDeleteArtist = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        console.log("CLiquei na exclusao");
    }

    return <>
        <Section flex paddingY2 gap>
            <Divider flex flexCol widthOneFiveDesktop>
                <Figure flex justifyCenter itemsCenter>
                    <Image src={Banjo} roundedT />
                </Figure>
                <Divider flex justifyBetween>
                    <Divider>
                        <H2 textXl>Leandro e Leonardo</H2>
                        <Fieldset flex itemsCenter gapX2>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <Input
                                type="text"
                                value={"Goianápolis"}
                            />
                            <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeArtistLocation(event, "teste")} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                <FontAwesomeIcon icon={faPen} />
                            </Button>
                        </Fieldset>
                        <Fieldset flex itemsCenter gapX2>
                            <H2 textXl>Albuns</H2>
                            <Span>15</Span>
                        </Fieldset>
                    </Divider>
                    <Divider>
                        <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteArtist(event, "teste")} icon deleteBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Divider>
                </Divider>
            </Divider>
            <div className="flex w-4/5 bg-teal-500">
                
            </div>

            {/* <Figure flex justifyCenter itemsCenter>
                <Image src={Banjo} />
            </Figure>
            <H1>Artista XXXXXXX</H1> */}
        </Section>
    </>
}

export default Artist;