import React, { useEffect, useState } from "react";
import { ArtistPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import getArtist from "../../api/artists";
import { ApiInformation } from "../../interfaces/ApiInformation";
import getAlbum from "../../api/album";
import songApi from "../../api/song";
import Swal from "sweetalert2";
import albumApi from "../../api/album";
import artistApi from "../../api/artists";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import { redirectPage } from "../../common/redirectPage";
import DetailContent from "../DetailContent/detailContent";

const Artist: React.FC<ArtistPageInterface> = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [artist, setArtist] = useState<ApiInformation>({
        "@assetType": "",
        assetType: "",
        "@key": "",
        key: "",
        name: '',
        lastTouchBy: "",
        lastTx: "",
        lastUpdated: "",
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

    const fetchData = async () => {
        try {
            setLoading(true);
            await getArtist().getArtistInfo(id)
                .then((response: ApiInformation) => {
                    setArtist(response)
                    return response;
                });
        } catch (err) {
            console.error(err)
            Swal.fire({
                title: "Error!",
                text: "Error on search artist data.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    };

    const id: string = location.state?.id;

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!location.state || !id) {
        return <Navigate to="/home" replace />;
    }

    const handleAddAlbum = async (event: React.MouseEvent<HTMLButtonElement>, idArtist: string) => {
        if (artist) {
            setModalCreateParams({
                ...modalCreateParams,
                open: true,
                title: `Add album`,
                tag: "album",
                buttonConfirm: true,
                buttonConfirmText: "Create",
                options: [{
                    label: artist.name,
                    value: artist["@key"]
                }],
                apiData: []
            });
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

    const handleSendModal = async (event: React.FormEvent, formData: ModalCreateInputInterface) => {
        try {
            setLoading(true);
            formData.idArtist = artist["@key"];

            const sendResponse = await handleConfirmModalAdd(event, formData, "album");

            if (sendResponse) {
                closeModalAdd();
                fetchData();
            }
        }
        catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Error while adding album.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    }

    const handleChangeCountryState = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (artist !== undefined && artist?.country !== undefined && e.target.value !== undefined) {
            setArtist({
                ...artist,
                country: e.target.value
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

    const handleClickChangeArtistLocation = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (artist && artist.country) {
                await getArtist().updateCountryArtist(id, artist?.country);
                await fetchData();
            }
            else throw new Error();
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleClickDeleteArtist = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            await artistApi().deleteArtist(id)
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
                text: "Error on delete artist.",
                icon: "error"
            });
        }
    }

    const handleClickChangeAlbumYear = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            setLoading(true);
            if (artist && artist.albuns) {
                const album: ApiInformation = artist.albuns.filter((element: ApiInformation) => element["@key"] === id)[0];

                if (album.year) {
                    await getAlbum().updateYearAlbum(id, album?.year)
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
                text: "Error on delete album.",
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    }



    const handleChangeAlbumYear = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (artist && artist.albuns !== undefined) {
            var updatedAlbuns: any = artist.albuns.map(album => {
                if (album["@key"] === id) {
                    return {
                        ...album,
                        year: Number(e.target.value)
                    };
                }
                return album;
            });

            setArtist({
                ...artist,
                albuns: updatedAlbuns
            })
        }
    }

    return <DetailContent 
        loading={loading}
        externalData={artist}
        type="artist"
        paramsModalCreate={modalCreateParams}
        handleSendModal={handleSendModal}
        handleDeleteSong={handleDeleteSong}
        handleChangeCountryState={handleChangeCountryState}
        handleClickChangeArtistLocation={handleClickChangeArtistLocation}
        handleClickDeleteArtist={handleClickDeleteArtist}
        handleAddAlbum={handleAddAlbum}
        handleChangeAlbumYear={handleChangeAlbumYear}
        handleClickChangeAlbumYear={handleClickChangeAlbumYear}
        handleDeleteAlbum={handleDeleteAlbum}
    />
}

export default Artist;