import React, { useEffect, useState } from "react";
import { PlaylistInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiInformation } from "../../interfaces/ApiInformation";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import playlistApi from "../../api/playlist";
import Swal from "sweetalert2";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import songApi from "../../api/song";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Divider from "../../components/Divider/Divider";
import Span from "../../components/Span/Span";
import Section from "../../components/Section/Section";
import ModalCreate from "../Modal/ModalCreate";
import Figure from "../../components/Figure/Figure";
import Image from "../../components/Image/Image";
import Banjo from "../../assets/img/banjo.jpg";
import H2 from "../../components/H2/H2";
import Fieldset from "../../components/Fieldset/Fieldset";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Aside from "../../components/Aside/Aside";
import H4 from "../../components/H4/H4";
import renderizeLoading from "../../common/renderizeLoading";
import { redirectPage } from "../../common/redirectPage";

const Playlist: React.FC<PlaylistInterface> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(true);
    const [playlist, setPlaylist] = useState<ApiInformation>({
        "@assetType": "",
        assetType: "",
        "@key": "",
        key: "",
        name: '',
        lastTouchBy: "",
        lastTx: "",
        lastUpdated: "",
        songs: [],
        private: false
    });
    const [songsList, setSongsList] = useState<ApiInformation[]>([]);

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
            setLoading(true);
            await songApi().getAllSongs()
                .then((response: any) => {
                    setSongsList(response)
                });

            await playlistApi().getPlaylistInfo(id)
                .then((response: any) => {
                    if (response) {
                        setPlaylist(response)
                    }
                    else throw new Error();
                });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: "Error during playlist search.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string) => {
        try {
            setLoading(true);

            formData.idPlaylist = playlist["@key"];
            const sendResponse = await handleConfirmModalAdd(event, formData, "playlist_add_song");

            if (sendResponse) {
                closeModalAdd();
                fetchData();
            }
        }
        catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Error while adding song on playlist.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    }

    const handleChangePrivate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            setPlaylist({ ...playlist, private: !playlist.private });            
            await playlistApi().updatePrivateStatus(playlist["@key"])
                .then((response: any) => {
                    console.log(response)
                })
                .catch((error: any) => {
                    throw new Error(error)
                })
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on change private status.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
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
        if (playlist) {
            setModalCreateParams({
                ...modalCreateParams,
                open: true,
                title: `Add song`,
                tag: "playlist",
                buttonConfirm: true,
                buttonConfirmText: "Create",
                options: [{
                    label: playlist?.name,
                    value: id
                }],
                apiData: songsList
            });
        }
    }

    const handleDeletePlaylist = async (event: React.MouseEvent<HTMLButtonElement>, idPlaylist: string) => {
        try {
            setLoading(true);
            await playlistApi().deletePlaylist(idPlaylist)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        redirectPage(navigate, undefined, "home");
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
                text: "Error on delete playlist.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    }

    const handleDeleteSong = async (event: React.MouseEvent<HTMLButtonElement>, idPlaylist: string, idSong: string) => {
        try {
            setLoading(true);
            await playlistApi().deletePlaylistSong(idPlaylist, idSong)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Sound deleted!",
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
        finally {
            setLoading(false);
        }
    }

    const renderSongs = (response: ApiInformation) => {
        if (response.songs && response.songs?.length > 0) {
            return <table className="w-full text-center">
                <thead>
                    <tr className={`bg-gray-600 text-white`}>
                        <th>#</th>
                        <th>Song</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {response.songs.map((song: ApiInformation, index: number) => {
                        if (song.album && song.artist) {
                            return <tr key={song["@key"]} className="even:bg-gray-500 even:bg-opacity-30">
                                <td>{index + 1}</td>
                                <td>{song.name}</td>
                                <td>{song.artist.name}</td>
                                <td>{song.album.name}</td>
                                <td>
                                    <Button type="button" icon deleteBackgroundColor textWhite rounded onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(event, response["@key"], song["@key"])}><FontAwesomeIcon icon={faTrash} /></Button>
                                </td>
                            </tr>
                        }
                    })}
                </tbody>
            </table>;
        }
        else return <Divider flex justifyCenter itemsCenter>
            <Span>Nothing registered there.</Span>
        </Divider>
    }

    return <>
        {renderizeLoading(loading)}

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
                        createOutsideHome={true}
                    />
                )
            }

            <Section flex flexCol widthOneFiveDesktop>
                <Figure flex justifyCenter itemsCenter>
                    <Image src={Banjo} roundedT />
                </Figure>
                <Divider flex flexCol widthFull backgroundGray padding2>
                    <H2 textXl>{playlist.name}</H2>

                    <Fieldset flex gapX2>
                        <Label for={`private`}>Private</Label>
                        <Input type="checkbox"
                            id={`private`}
                            name={`private`}
                            checked={playlist.private}
                            //value={undefined}
                            onChange={handleChangePrivate} border />
                    </Fieldset>
                </Divider>

                <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeletePlaylist(event, playlist["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter roundedB textWhite gapX2>
                    DELETE
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Section>
            <Aside flex flexColumn widthFourFiveDesktop>
                <Divider flex flexCol gap2>
                    <Divider flex justifyBetween itemsCenter>
                        <H4 textXl>Songs</H4>
                        <Button
                            type="button"
                            rounded textWhite uppercase border paddingX2 successBackgroundColor
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleAddSong(event, playlist["@key"])}
                        >Add song</Button>
                    </Divider>
                    <Divider flex flexCol backgroundGray border rounded gap2>
                        {renderSongs(playlist)}
                    </Divider>
                </Divider>
            </Aside>
        </Divider >

    </>
}

export default Playlist;