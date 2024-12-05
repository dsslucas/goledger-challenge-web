import React, { useEffect, useState } from "react";
import getPlaylist from "../../api/playlist";
import { ColorInterface, SchemaSectionInterface } from "../../Interface";
import getAlbum from "../../api/album";
import getSong from "../../api/song";
import { ApiInformation, ArtistSend } from "../../interfaces/ApiInformation";
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
import Figure from "../../components/Figure/Figure";
import Image from "../../components/Image/Image";
import Swal from "sweetalert2";
import ModalCreate from "../Modal/ModalCreate";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import artistApi from "../../api/artists";
import { Option } from "../../components/Select/Interface";
import albumApi from "../../api/album";
const Home = () => {
    const navigation = useNavigate();

    const [apiColors, setApiColors] = useState<ColorInterface>();
    const [schema, setSchema] = useState<SchemaSectionInterface[]>();

    // Data
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [buttonClickedLabel, setButtonClickedLabel] = useState<string>("");

    const [getApiData, setGetApiData] = useState<ApiInformation[]>([]);
    const [artistsList, setArtistsList] = useState<Option[]>([]);

    const [modalCreateParams, setModalCreateParams] = useState<ModalCreateInterface>({
        open: false,
        title: "",
        tag: "",
        buttonConfirm: false,
        buttonConfirmText: "",
        options: []
    });

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
        console.log("opa joia", tag)
        setModalCreateParams({
            ...modalCreateParams,
            open: true,
            title: `Add ${String(buttonClickedLabel).charAt(0).toUpperCase() + String(buttonClickedLabel).slice(1)}`,
            tag: buttonClickedLabel.toLowerCase(),
            buttonConfirm: true,
            buttonConfirmText: "Adicionar",
            options: artistsList
        });
    }

    const handleClickOption = async (event: React.MouseEvent<HTMLButtonElement>, label: string, tag: string) => {
        setButtonClicked(true);
        setButtonClickedLabel(label);

        switch (tag) {
            case "artist":
                setGetApiData(await artistApi().getAllArtists());
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

    const handleCancelModalAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
        closeModalAdd();
    }

    const closeModalAdd = () => {
        setModalCreateParams({
            ...modalCreateParams,
            open: false,
            title: "",
            tag: "",
            buttonConfirm: false,
            buttonConfirmText: ""
        });
    }

    const handleConfirmModalAdd = async (event: React.FormEvent, formData: ModalCreateInputInterface) => {
        event.preventDefault();

        console.log("NO FORMULARIO: ", formData)

        if(!formData) {
            Swal.fire({
                title: "Erro!",
                text: "Os dados não foram enviados por falha interna.",
                icon: "error"
            });
            return false;
        }

        if (buttonClickedLabel.toLowerCase() === "artist") {
            if (formData?.name && formData?.country) {
                const data = {
                    name: formData.name,
                    country: formData.country
                }

                await artistApi().postNewArtist(data)
                    .then((response: any) => {
                        Swal.fire({
                            title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                            text: response.message,
                            icon: response.positiveConclusion ? "success" : "error",
                        });

                        if (response.positiveConclusion) {
                            closeModalAdd();
                            fetchData();
                        }
                    })
                    .catch((error: any) => {
                        console.error(error)
                        Swal.fire({
                            title: "Erro!",
                            text: error.response.message,
                            icon: "error"
                        });
                    })
            }
            else if (!formData?.name) {
                Swal.fire({
                    title: "Erro!",
                    text: "Informe o nome do artista.",
                    icon: "error"
                });
            }
            else if (!formData?.country) {
                Swal.fire({
                    title: "Erro!",
                    text: "Informe o país do artista.",
                    icon: "error"
                });
            }
        }
        if (buttonClickedLabel.toLowerCase() === "album") {
            const data: any = {
                idArtist: formData.idArtist,
                name: formData.name,
                year: formData.year,
                songs: formData.songs
            }
            console.log("ANTES DO ENVIO: ", data)

            await albumApi().registerNewAlbum(data)
                .then((response: any) => {
                    Swal.fire({
                        title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                        text: response.message,
                        icon: response.positiveConclusion ? "success" : "error",
                    });

                    if (response.positiveConclusion) {
                        closeModalAdd();
                        fetchData();
                    }
                })
                .catch((error: any) => {
                    console.error(error)
                    Swal.fire({
                        title: "Erro!",
                        text: error.response.message,
                        icon: "error"
                    });
                })
        }
    }

    const fetchData = async () => {
        await Promise.all([getHeader(), getSchema()]);
        const artists = await artistApi().getAllArtists();
        setGetApiData(artists);

        artists.forEach((element: ApiInformation) => {
            var temp = artistsList;

            temp.push({
                label: element.name,
                value: element["@key"]
            })
            setArtistsList(temp);
        })

        setButtonClicked(true);
        setButtonClickedLabel("Artist");
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        {modalCreateParams.open && artistsList && (
            <ModalCreate
                open={modalCreateParams.open}
                title={modalCreateParams.title}
                tag={modalCreateParams.tag}
                onCancel={handleCancelModalAdd}
                onConfirm={(e: React.FormEvent, data: ModalCreateInputInterface) => handleConfirmModalAdd(e, data)}
                buttonConfirm={modalCreateParams.buttonConfirm}
                buttonConfirmText={modalCreateParams.buttonConfirmText}
                options={modalCreateParams.options}
            />
        )}
        <Section flex justifyCenter paddingY2>
            <Divider flex justifyBetween widthOneHalf>
                {schema && schema?.length > 0 && (
                    schema.map((element: SchemaSectionInterface, index: number) => {
                        return <Button type="button" key={index} border rounded paddingX2 borderColorHover={apiColors?.gray} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickOption(e, element.label, element.tag)}>{element.label}</Button>
                    })
                )}
            </Divider>
        </Section>
        <Aside flex flexColumn widthFull gap2>
            {buttonClicked && (
                <>
                    <Divider flex justifyBetween>
                        <H1 text2xl>{buttonClickedLabel}</H1>
                        <Button type="button" rounded textWhite uppercase border paddingX2 backgroundColor="success" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickAdd(e, buttonClickedLabel.toLowerCase())}>Add</Button>
                    </Divider>

                    <Divider grid gridColsCategories gap3>
                        {getApiData && getApiData.map((element: ApiInformation, key: number) => {
                            return <Button type="button" flex flexColumn widthFull
                                backgroundColor="gray-300"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickCategory(e, element.key, element.assetType)}
                                key={key}
                            >
                                <Figure flex justifyCenter itemsCenter>
                                    <Image src={Banjo} widthFull roundedT />
                                </Figure>
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