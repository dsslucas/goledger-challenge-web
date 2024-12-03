import React, { useEffect, useState } from "react";
import getArtist from "../../api/artists";
import getPlaylist from "../../api/playlist";
import { ColorInterface, SchemaSectionInterface } from "../../Interface";
import getAlbum from "../../api/album";
import getSong from "../../api/song";
import { ApiInformation } from "../../interfaces/ApiInformation";
import api from "../../api/api";
import Section from "../../components/Section/Section";
import Divider from "../../components/Divider/Divider";
import Button from "../../components/Button/Button";
import Aside from "../../components/Aside/Aside";
import H1 from "../../components/H1/H1";
import H2 from "../../components/H2/H2";
import Fieldset from "../../components/Fieldset/Fieldset";
import Span from "../../components/Span/Span";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Banjo from "../../assets/img/banjo.jpg";
import { useNavigate } from "react-router";

const Home = () => {
    const navigation = useNavigate();

    const [apiColors, setApiColors] = useState<ColorInterface>();
    const [schema, setSchema] = useState<SchemaSectionInterface[]>();

    // Data
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [buttonClickedLabel, setButtonClickedLabel] = useState<string>("");

    const [getApiData, setGetApiData] = useState<ApiInformation[]>([]);

    const getHeader = async () => {
        await api.get("/query/getHeader").then((response: any) => {
            setApiColors({
                gray: response.data.colors[0],
                blue: response.data.colors[1],
                silver: response.data.colors[2]
            });
        });
    }

    const getSchema = async () => {
        await api.get("/query/getSchema")
            .then((response: any) => {
                if (Array.isArray(response.data)) {
                    setSchema(response.data.filter((element: SchemaSectionInterface) => element.label !== "AssetTypeListData"));
                }
            })
    }

    const handleClickAdd = (event: React.MouseEvent<HTMLButtonElement>, tag: string) => {
    }

    const handleClickOption = async (event: React.MouseEvent<HTMLButtonElement>, label: string, tag: string) => {
        setButtonClicked(true);
        setButtonClickedLabel(label);

        switch (tag) {
            case "artist":
                setGetApiData(await getArtist().getAllArtists());
                break;
            case "album":
                setGetApiData(await getAlbum().getAllAlbums());
                break;
            case "song":
                setGetApiData(await getSong().getAllSongs());
                break;
            case "playlist":
                setGetApiData(await getPlaylist().getAllPlaylists());
                break;
            default:
                break;
        }
    }

    const handleClickCategory = (event: React.MouseEvent<HTMLButtonElement>, id: string, tag: string) => {
        navigation(`/${tag}`, {
            state: {
                id: id,
            }
        });

        console.log(tag);
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getHeader(), getSchema()]);
        };

        fetchData();
    }, []);

    return <>
        <Section flex justifyCenter paddingY2>
            <Divider flex justifyBetween widthOneHalf>
                {schema && schema?.length > 0 && (
                    schema.map((element: SchemaSectionInterface, index: number) => {
                        return <Button key={index} border rounded paddingX2 borderColorHover={apiColors?.gray} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickOption(e, element.label, element.tag)}>{element.label}</Button>
                    })
                )}
            </Divider>
        </Section>
        <Aside flex flexColumn widthFull gap2>
            {buttonClicked && (
                <>
                    <Divider flex justifyBetween>
                        <H1 text2xl>{buttonClickedLabel}</H1>
                        <Button rounded textWhite uppercase border paddingX2 backgroundColor="success" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickAdd(e, "teste")}>Add</Button>
                    </Divider>

                    <Divider grid gridColsCategories gap3>
                        {getApiData && getApiData.map((element: ApiInformation, key: number) => {
                            return <Button flex flexColumn widthFull
                                backgroundColor="gray-300"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickCategory(e, element.key, element.assetType)}
                                key={key}
                            >
                                <figure className="flex justify-center items-center">
                                    <img src={Banjo} alt="banjo" className="w-full rounded-t" />
                                </figure>
                                <Divider flex justifyBetween widthFull gapX2 padding2>
                                    <Divider>
                                        <H2 textXl>{element.name}</H2>
                                        {element.artist != null && (
                                            <Fieldset flex itemsCenter gapX2>
                                                <Span details>{element.artist.name}</Span>
                                            </Fieldset>
                                        )}
                                        {element.album != null && (
                                            <Fieldset flex itemsCenter gapX2>
                                                <Span details>{element.album.name}</Span>
                                            </Fieldset>
                                        )}
                                        {element.year != null && (
                                            <Fieldset flex itemsCenter gapX2>
                                                <Span details>{element.year}</Span>
                                            </Fieldset>
                                        )}
                                        {element.country != null && (
                                            <Fieldset flex itemsCenter gapX2>
                                                <FontAwesomeIcon icon={faLocationDot} />
                                                <Span details>{element.country}</Span>
                                            </Fieldset>
                                        )}
                                        {element.songs != null && element.songs.length > 0 && (
                                            <Fieldset flex itemsCenter gapX2>
                                                <Span details>{element.songs.length} {element.songs.length === 1 ? 'song' : 'songs'}</Span>
                                            </Fieldset>
                                        )}
                                    </Divider>
                                </Divider>
                            </Button>
                        })}
                    </Divider>
                </>
            )}
        </Aside>
    </>
}

export default Home;