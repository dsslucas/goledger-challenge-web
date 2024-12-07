import React, { useEffect, useState } from "react";
import { AlbumPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiInformation } from "../../interfaces/ApiInformation";
import albumApi from "../../api/album";
import Swal from "sweetalert2";
import Button from "../../components/Button/Button";
import { faLocationDot, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "../../components/Divider/Divider";
import Span from "../../components/Span/Span";
import Section from "../../components/Section/Section";
import Figure from "../../components/Figure/Figure";
import H2 from "../../components/H2/H2";
import Fieldset from "../../components/Fieldset/Fieldset";
import Input from "../../components/Input/Input";
import Image from "../../components/Image/Image";
import Banjo from "../../assets/img/banjo.jpg";
import songApi from "../../api/song";
import Label from "../../components/Label/Label";
import Aside from "../../components/Aside/Aside";
import CountryRoads from "../../assets/img/country.jpg";
import H1 from "../../components/H1/H1";
import H4 from "../../components/H4/H4";
import ModalCreate from "../Modal/ModalCreate";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";

const Album: React.FC<AlbumPageInterface> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [album, setAlbum] = useState<ApiInformation | null>(null);
    const [modalCreateParams, setModalCreateParams] = useState<ModalCreateInterface>({
        open: false,
        title: "",
        tag: "",
        buttonConfirm: false,
        buttonConfirmText: "",
        options: []
    });

    const id: string = location.state?.id;

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!location.state || !id) {
        return <Navigate to="/home" replace />;
    }

    const fetchData = async () => {
        try {
            await albumApi().getAlbumById(id)
                .then((response: ApiInformation) => {
                    console.log(response)
                    if (response) {
                        setAlbum(response)
                        console.log(response)
                        return response;
                    }
                    else throw new Error();
                });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: "Error during album search.",
                icon: "error"
            });
        }
    };

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string) => {
        const sendResponse = await handleConfirmModalAdd(event, formData, tag);

        console.log(sendResponse)

        if (sendResponse) {
            closeModalAdd();
            fetchData();
        }
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

    const handleAddSong = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        if (album) {
            setModalCreateParams({
                ...modalCreateParams,
                open: true,
                title: `Add song`,
                tag: "song",
                buttonConfirm: true,
                buttonConfirmText: "Create",
                options: [{
                    label: album?.name,
                    value: id
                }],
                apiData: []
            });
        }
    }

    const handleClickChangeAlbumYear = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (album?.year) {
                await albumApi().updateYearAlbum(id, album?.year)
                    .then((response: any) => {
                        if (response.status) {
                            Swal.fire({
                                title: "Updated!",
                                text: response.message,
                                icon: "success"
                            });
                            fetchData();
                        }
                        else Swal.fire({
                            title: "Error!",
                            text: response.message,
                            icon: "error"
                        });
                    });
            }
            else throw new Error();
        }
        catch (e) {
            console.error(e);
            Swal.fire({
                title: "Error!",
                text: "Error on update album year.",
                icon: "error"
            });
        }
    }

    const handleDeleteAlbum = async (event: React.MouseEvent<HTMLButtonElement>, idAlbum: string) => {
        console.log("Cliquei na exclusao do album");
        console.log(idAlbum)
        try {
            await albumApi().deleteAlbum(idAlbum)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        navigate("/home");
                    }
                    else Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error"
                    });
                });
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on delete album.",
                icon: "error"
            });
        }
    }

    const handleChangeAlbumYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (album && e.target.value !== "") {
            setAlbum({
                ...album,
                year: Number(e.target.value)
            })
        }
    }

    const handleDeleteSong = async (event: React.MouseEvent<HTMLButtonElement>, idSong: string) => {
        try {
            await songApi().deleteSong(idSong)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        fetchData();
                    }
                    else Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error"
                    });
                });
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on delete song.",
                icon: "error"
            });
        }
    }

    const renderSongs = (album: ApiInformation) => {
        if (album.songs && album.songs?.length > 0) {
            return <table className="w-full text-center">
                <thead>
                    <tr className={`bg-gray-600 text-white`}>
                        <th>#</th>
                        <th>Song</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {album.songs && album.songs.map((song: ApiInformation, index: number) => {
                        if (song.album) return <tr key={song["@key"]} className="even:bg-gray-500 even:bg-opacity-30">
                            <td>{index + 1}</td>
                            <td>{song.name}</td>
                            <td>
                                <Button type="button" icon deleteBackgroundColor textWhite rounded onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(event, song["@key"])}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>;
        }
        else return <Divider flex justifyCenter itemsCenter>
            <Span>Nothing registered there.</Span>
        </Divider>
    }

    if (!album) return <Divider>Loading...</Divider>

    return <>
        {album && (
            <Divider flex paddingY2 gap2>
                {
                    modalCreateParams.open && (
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
                    )
                }

                <Section flex flexCol widthOneFiveDesktop>
                    <Figure flex justifyCenter itemsCenter>
                        <Image src={Banjo} roundedT />
                    </Figure>
                    <Divider flex flexCol widthFull backgroundGray padding2>
                        <H2 textXl>{album.name}</H2>

                        <Fieldset flex itemsCenter gapX2>
                            <Span>{album.artist?.name}</Span>
                        </Fieldset>

                        <Fieldset flex flexColumn gapX2>
                            <Label for={`album-year-${album["@key"]}`}>Year</Label>
                            <Divider flex gap2>
                                <Input
                                    type="number"
                                    id={`album-year-${album["@key"]}`}
                                    name={`album-year-${album["@key"]}`}
                                    value={album.year}
                                    required
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAlbumYear(e)}
                                    rounded border backgroundTransparent />
                                <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeAlbumYear(event, album["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                    <FontAwesomeIcon icon={faPen} />
                                </Button>
                            </Divider>
                        </Fieldset>
                    </Divider>

                    <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteAlbum(event, album["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter roundedB textWhite gapX2>
                        DELETE
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </Section>
                <Aside flex flexColumn widthFourFiveDesktop>
                    <Divider flex flexCol gap2>
                        <Divider flex justifyBetween itemsCenter>
                            <H4 textXl>Album songs</H4>
                            <Button
                                type="button"
                                rounded textWhite uppercase border paddingX2 successBackgroundColor
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleAddSong(event, album["@key"])}
                            >Add song</Button>
                        </Divider>
                        <Divider flex flexCol backgroundGray border rounded gap2>
                            {renderSongs(album)}
                        </Divider>
                    </Divider>
                </Aside>
            </Divider >
        )}
    </>
}

export default Album;