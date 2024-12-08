import React, { useEffect, useState } from "react";
import { AlbumPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiInformation } from "../../interfaces/ApiInformation";
import albumApi from "../../api/album";
import Swal from "sweetalert2";
import songApi from "../../api/song";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import { redirectPage } from "../../common/redirectPage";
import DetailContent from "../DetailContent/detailContent";

const Album: React.FC<AlbumPageInterface> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(true);
    const [album, setAlbum] = useState<ApiInformation>({
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
            await albumApi().getAlbumById(id)
                .then((response: ApiInformation) => {
                    if (response) {
                        setAlbum(response)
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
        finally {
            setLoading(false);
        }
    };

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface) => {
        try {
            setLoading(true);
            const sendResponse = await handleConfirmModalAdd(event, formData, modalCreateParams.tag);

            if (sendResponse) {
                closeModalAdd();
                fetchData();
            }
        }
        catch (error: any) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Error on send request.",
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
            setLoading(true);
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
        finally {
            setLoading(false);
        }
    }

    const handleDeleteAlbum = async (event: React.MouseEvent<HTMLButtonElement>, idAlbum: string) => {
        try {
            setLoading(true);
            await albumApi().deleteAlbum(idAlbum)
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
                text: "Error on delete album.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
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
            setLoading(true);
            await songApi().deleteSongHandler(idSong)
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
        finally {
            setLoading(false);
        }
    }

    return <DetailContent 
        loading={loading}
        externalData={album}
        type="album"
        paramsModalCreate={modalCreateParams}
        handleSendModal={handleSendModal}
        handleDeleteSong={handleDeleteSong}
        handleChangeAlbumYear={handleChangeAlbumYear}
        handleClickChangeAlbumYear={handleClickChangeAlbumYear}
        handleDeleteAlbum={handleDeleteAlbum}
        handleAddSong={handleAddSong}
    />   
}

export default Album;