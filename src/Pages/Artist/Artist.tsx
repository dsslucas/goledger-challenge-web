import React, { useEffect, useState } from "react";
import { ArtistPageInterface } from "./Interface";
import { useLocation, useNavigate } from "react-router";
import Section from "../../components/Section/Section";
import H1 from "../../components/H1/H1";
import getArtist from "../../api/artists";
import Banjo from "../../assets/img/banjo.jpg";
import CountryRoads from "../../assets/img/country.jpg";
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
import { ApiInformation } from "../../interfaces/ApiInformation";
import Aside from "../../components/Aside/Aside";
import getAlbum from "../../api/album";

const Artist: React.FC<ArtistPageInterface> = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const id = location.state.id;

    if (id === undefined || id === null) navigation("/home");

    const [data, setData] = useState<ApiInformation>();

    const fetchData = async () => {
        const data = await getArtist().getArtistInfo(id);
        console.log("DADOS VINDOS DA API: ", data);
        setData(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleClickChangeArtistLocation = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (data && data.country) {
                await getArtist().updateCountryArtist(id, data?.country);
                await fetchData();
            }
            else throw new Error;
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleClickDeleteArtist = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        console.log("CLiquei na exclusao");
    }

    const handleClickChangeAlbumYear = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (data && data.albuns) {
                const album: ApiInformation = data.albuns.filter((element: ApiInformation) => element["@key"] === id)[0];

                if (album.year) {
                    await getAlbum().updateYearAlbum(id, album?.year);
                    await fetchData();
                }
            }
            else throw new Error;
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleDeleteSong = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        console.log("CLiquei na exclusao da musica");
    }

    const handleChangeCountryState = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (data != undefined) {
            setData({
                ...data,
                country: e.target.value
            })
        }
    }

    const handleChangeAlbumYear = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (data && data.albuns != undefined) {
            var updatedAlbuns: any = data.albuns.map(album => {
                if (album["@key"] === id) {
                    return {
                        ...album,
                        year: Number(e.target.value)
                    };
                }
                return album;
            });

            setData({
                ...data,
                albuns: updatedAlbuns
            })
        }
    }

    return <>
        {data && (
            <>
                <Divider flex paddingY2 gap2>
                    <Section flex flexCol widthOneFiveDesktop>
                        <Figure flex justifyCenter itemsCenter>
                            <Image src={Banjo} roundedT />
                        </Figure>
                        <Divider flex flexCol widthFull backgroundGray padding2>
                            <H2 textXl>{data.name}</H2>
                            <Fieldset flex itemsCenter gapX2 height7>
                                <FontAwesomeIcon icon={faLocationDot} />
                                <Input
                                    type="text"
                                    value={data.country}
                                    rounded
                                    border
                                    backgroundTransparent
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCountryState(e, data["@key"])}
                                />
                                <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeArtistLocation(event, data["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                    <FontAwesomeIcon icon={faPen} />
                                </Button>
                            </Fieldset>
                            <Fieldset flex itemsCenter gapX2>
                                <H2 textXl>Albuns</H2>
                                <Span>{data.albuns?.length}</Span>
                            </Fieldset>
                        </Divider>
                        <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickDeleteArtist(event, data["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter roundedB textWhite gapX2>
                            DELETAR
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Section>
                    <Aside flex flexColumn widthFourFiveDesktop>
                        <Divider flex flexCol gap2>
                            {data && data.albuns && (
                                data.albuns.map((element: ApiInformation, key: number) => {
                                    return <Divider flex flexCol backgroundGray border rounded key={key}>
                                        <Divider flex gapX2>
                                            <Figure flex justifyCenter widthOneSixDesktop>
                                                <Image src={CountryRoads} />
                                            </Figure>
                                            <Divider flex flexCol>
                                                <Fieldset flex flexColumn>
                                                    <H1 text3xl>{element.name}</H1>
                                                </Fieldset>
                                                <Fieldset flex gapX2 height7>
                                                    <Input
                                                        type="number"
                                                        value={element.year}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAlbumYear(e, element["@key"])}
                                                        rounded border backgroundTransparent />
                                                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeAlbumYear(event, element["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </Button>
                                                </Fieldset>
                                            </Divider>

                                        </Divider>
                                        <Divider>
                                            <span>{element.songs?.length}</span>
                                            {Array.isArray(element.songs) && element.songs?.length > 0 && (
                                                <table className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Song</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {element.songs.map((song: ApiInformation, index: number) => {
                                                            return <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{song.name}</td>
                                                                <td>
                                                                    <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(e, song["@key"])}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            )}
                                        </Divider>
                                    </Divider>
                                })
                            )}
                        </Divider>

                    </Aside>

                    {/* <Figure flex justifyCenter itemsCenter>
                <Image src={Banjo} />
            </Figure>
            <H1>Artista XXXXXXX</H1> */}
                </Divider>
            </>
        )}
    </>
}

export default Artist;