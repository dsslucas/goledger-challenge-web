import React, { useEffect, useState } from "react";
import { ArtistPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import getArtist from "../../api/artists";
import { ApiInformation } from "../../interfaces/ApiInformation";
import getAlbum from "../../api/album";
import songApi from "../../api/song";
import albumApi from "../../api/album";
import artistApi from "../../api/artists";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import { handleConfirmModalAdd } from "../../common/sendModalAdd";
import { redirectPage } from "../../common/redirectPage";
import DetailContent from "../DetailContent/detailContent";
import { sweetAlertHandler } from "../../common/sweetAlertHandler";

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
            await sweetAlertHandler("Error!", "Error on search artist data.", "error", () => null, () => null, false);
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
            await sweetAlertHandler("Error!", "Error while adding album.", "error", () => null, () => null, false);
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
            true
        );
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
        await sweetAlertHandler(
            "Are you sure?",
            "This action is irreversible.",
            "question",
            () => null,
            async () => {
                try {
                    await artistApi().deleteArtist(id)
                        .then(async (response: any) => {
                            if (response.status) {
                                await sweetAlertHandler("Deleted!", response.message, "success", () => null, () => redirectPage(navigate, undefined, "home"), false);
                            }
                            else await sweetAlertHandler("Error!", response.message, "error", () => null, () => null, false);
                        });
                }
                catch (error: any) {
                    console.error(error)
                    await sweetAlertHandler("Error!", "Error on delete artist.", "error", () => null, () => null, false);
                }
            },
            true
        );
    }

    const handleClickChangeAlbumYear = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            setLoading(true);
            if (artist && artist.albuns) {
                const album: ApiInformation = artist.albuns.filter((element: ApiInformation) => element["@key"] === id)[0];

                if (album.year) {
                    await getAlbum().updateYearAlbum(id, album?.year)
                        .then(async (response: any) => {
                            if (response.status) {
                                await sweetAlertHandler("Updated!", response.message, "success", () => null, () => fetchData(), false);
                            }
                            else await sweetAlertHandler("Error!", response.message, "error", () => null, () => null, false);
                        });
                }
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
                                await sweetAlertHandler("Deleted!", response.message, "success", () => null, () => fetchData(), false);
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
            true
        );
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