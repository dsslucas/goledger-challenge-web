import React, { useEffect, useState } from "react";
import { AlbumPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ApiInformation } from "../../interfaces/ApiInformation";
import albumApi from "../../api/album";
import songApi from "../../api/song";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import { redirectPage } from "../../common/redirectPage";
import DetailContent from "../DetailContent/detailContent";
import { sweetAlertHandler } from "../../common/sweetAlertHandler";

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
            await sweetAlertHandler("Error!", "Error during album search.", "error", () => null, () => null, false);
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
            await sweetAlertHandler("Error!", "Error on send request.", "error", () => null, () => null, false);
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
                    .then(async (response: any) => {
                        if (response.status) {
                            await sweetAlertHandler("Updated!", response.message, "success", () => null, () => fetchData(), false);
                        }
                        else await sweetAlertHandler("Error!", response.message, "error", () => null, () => null, false);
                    });
            }
            else throw new Error();
        }
        catch (e) {
            console.error(e);
            await sweetAlertHandler("Error!", "Error on update album year.", "error", () => null, () => null, false);
        }
        finally {
            setLoading(false);
        }
    }

    const handleDeleteAlbum = async (event: React.MouseEvent<HTMLButtonElement>, idAlbum: string) => {
        await sweetAlertHandler(
            "Are you sure?",
            "This action is irreversible.",
            "question",
            () => null,
            async () => {
                try {
                    setLoading(true);
                    await albumApi().deleteAlbum(idAlbum)
                        .then(async (response: any) => {
                            if (response.status) {
                                await sweetAlertHandler(
                                    "Deleted!", 
                                    response.message, 
                                    "success", 
                                    () => null, 
                                    () => {
                                        redirectPage(navigate, undefined, "home");
                                    }, 
                                    false
                                );                                
                            }
                            else await sweetAlertHandler("Error!", response.message, "error", () => null, () => null, false);
                        });
                }
                catch (error: any) {
                    console.error(error)
                    await sweetAlertHandler("Error!", "Error on delete album.", "error", () => null, () => null, false);
                }
                finally {
                    setLoading(false);
                }
            },
            true);
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
        await sweetAlertHandler(
            "Are you sure?",
            "This action is irreversible.",
            "question",
            () => null,
            async () => {
                try {
                    setLoading(true);
                    await songApi().deleteSongHandler(idSong)
                        .then(async (response: any) => {
                            if (response.status) {
                                await sweetAlertHandler("Deleted!", response.message, "success", () => null, () => fetchData(), false);
                            }
                            else await sweetAlertHandler("Error!", response.message, "error", () => null, () => null, false);
                        });
                }
                catch (error: any) {
                    console.error(error)
                    await sweetAlertHandler("Error!", "Error on delete song.", "error", () => null, () => null, false);
                }
                finally {
                    setLoading(false);
                }
            },
            true);
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