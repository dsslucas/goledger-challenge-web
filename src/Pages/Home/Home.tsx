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
import songApi from "../../api/song";
import playlistApi from "../../api/playlist";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
const Home = () => {
    const navigation = useNavigate();

    const [apiColors, setApiColors] = useState<ColorInterface>();
    const [schema, setSchema] = useState<SchemaSectionInterface[]>();

    // Data
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [buttonClickedLabel, setButtonClickedLabel] = useState<string>("Artist");

    const [getApiData, setGetApiData] = useState<ApiInformation[]>([]);
    const [artistsList, setArtistsList] = useState<Option[]>([]);
    const [albunsList, setAlbunsList] = useState<Option[]>([]);
    const [songsList, setSongsList] = useState<ApiInformation[]>([]);

    const [modalCreateParams, setModalCreateParams] = useState<ModalCreateInterface>({
        open: false,
        title: "",
        tag: "",
        buttonConfirm: false,
        buttonConfirmText: "",
        options: []
    });

    const getSchema = async () => {
        await api.get("/query/getSchema")
            .then((response: any) => {
                if (Array.isArray(response.data)) {
                    setSchema(response.data.filter((element: SchemaSectionInterface) => element.label !== "AssetTypeListData"));
                }
            })
    }

    const handleClickAdd = async (event: React.MouseEvent<HTMLButtonElement>, tag: string) => {
        function renderOption() {
            if (buttonClickedLabel.toLowerCase() === "album") return artistsList;
            else if (buttonClickedLabel.toLowerCase() === "song") return albunsList;
            else return [];
        }

        setModalCreateParams({
            ...modalCreateParams,
            open: true,
            title: `Add ${String(buttonClickedLabel).charAt(0).toUpperCase() + String(buttonClickedLabel).slice(1)}`,
            tag: buttonClickedLabel.toLowerCase(),
            buttonConfirm: true,
            buttonConfirmText: "Create",
            options: renderOption(),
            apiData: buttonClickedLabel.toLowerCase() === "playlist" ? songsList : []
        });
    }

    const renderizeDataCategory = async (tag: string) => {
        try {
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
        catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: "Error during list search.",
                icon: "error"
            });
        }
    }

    const handleClickOption = async (event: React.MouseEvent<HTMLButtonElement>, label: string, tag: string) => {
        setButtonClicked(true);
        setButtonClickedLabel(label);
        await renderizeDataCategory(tag);
    }

    const handleClickCategory = (event: React.MouseEvent<HTMLButtonElement>, id: string, tag: string) => {
        navigation(`/${tag}`, {
            state: {
                id: id,
            }
        });
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

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string) => {
        const sendResponse = await handleConfirmModalAdd(event, formData, tag);

        if (sendResponse) {
            closeModalAdd();
            fetchData();
        }
    }

    const fetchData = async () => {
        await Promise.all([getSchema()]);
        const artists = await artistApi().getAllArtists();
        artists.forEach((element: ApiInformation) => {
            var temp = artistsList;

            temp.push({
                label: element.name,
                value: element["@key"]
            })
            setArtistsList(temp);
        });

        await renderizeDataCategory(buttonClickedLabel.toLowerCase());

        const albuns = await albumApi().getAllAlbums();
        albuns.forEach((response: ApiInformation) => {
            var temp = albunsList;

            temp.push({
                label: response.name,
                value: response["@key"]
            })
            setAlbunsList(temp);
        })

        const songs = await songApi().getAllSongs();
        setSongsList(songs);

        setButtonClicked(true);
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
                onConfirm={(e: React.FormEvent, data: ModalCreateInputInterface) => handleSendModal(e, data, modalCreateParams.tag)}
                buttonConfirm={modalCreateParams.buttonConfirm}
                buttonConfirmText={modalCreateParams.buttonConfirmText}
                options={modalCreateParams.options}
                apiData={modalCreateParams.apiData}
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