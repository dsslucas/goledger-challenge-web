import React, { useEffect, useState } from "react";
import { PlaylistInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiInformation } from "../../interfaces/ApiInformation";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import playlistApi from "../../api/playlist";
import Swal from "sweetalert2";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import songApi from "../../api/song";
import { redirectPage } from "../../common/redirectPage";
import DetailContent from "../DetailContent/detailContent";

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
        private: false,
        image: ""
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface) => {
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

    const handleDeleteSong = async (event: React.MouseEvent<HTMLButtonElement>, idSong: string) => {
        try {
            setLoading(true);
            await playlistApi().deletePlaylistSong(playlist["@key"], idSong)
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

    return <DetailContent
        loading={loading}
        externalData={playlist}
        type="playlist"
        paramsModalCreate={modalCreateParams}
        handleSendModal={handleSendModal}
        handleDeleteSong={handleDeleteSong}
        handleAddSong={handleAddSong}
        handleChangePrivate={handleChangePrivate}
        handleDeletePlaylist={handleDeletePlaylist}
    />
}

export default Playlist;