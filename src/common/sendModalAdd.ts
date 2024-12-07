import Swal from "sweetalert2";
import { ModalCreateInputInterface } from "../Pages/Modal/Interface";
import artistApi from "../api/artists";
import albumApi from "../api/album";
import songApi from "../api/song";
import playlistApi from "../api/playlist";
import { AlbumSend, ResponseData } from "../interfaces/ApiInformation";

export const handleConfirmModalAdd = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string): Promise<ResponseData> => {
    event.preventDefault();

    if (!formData) {
        await Swal.fire({
            title: "Error!",
            text: "Internal error.",
            icon: "error"
        });
        return {
            status: false,
            message: "Internal error.",
            "@key": null
        }
    }

    try {
        if (tag.toLowerCase() === "artist") {
            if (!formData?.name) {
                await Swal.fire({
                    title: "Error!",
                    text: "You should inform the artist name.",
                    icon: "error"
                });
                return {
                    status: false,
                    message: "You should inform the artist name.",
                    "@key": null
                }
            }

            if (!formData?.country) {
                await Swal.fire({
                    title: "Error!",
                    text: "You should inform the country of artist.",
                    icon: "error"
                });
                return {
                    status: false,
                    message: "You should inform the country of artist.",
                    "@key": null
                }
            }

            const data = {
                name: formData.name,
                country: formData.country,
            };

            const response: ResponseData = await artistApi().postNewArtist(data);
            await Swal.fire({
                title: response.status ? "Success!" : "Error!",
                text: response.message,
                icon: response.status ? "success" : "error",
            });

            return {
                "@key": response["@key"],
                status: response.status,
                message: response.message
            };
        }

        if (tag.toLowerCase() === "album") {
            const data: any = {
                idArtist: formData.idArtist,
                name: formData.name,
                year: formData.year,
                songs: formData.songs,
            };

            const response: ResponseData = await albumApi().registerNewAlbum(data);
            await Swal.fire({
                title: response.status ? "Success!" : "Error!",
                text: response.message,
                icon: response.status ? "success" : "error",
            });

            return {
                "@key": response["@key"],
                status: response.status,
                message: response.message
            };
        }

        if (tag.toLowerCase() === "song") {
            const data: any = {
                idAlbum: formData.idAlbum,
                songs: formData.songs,
            };

            const response: ResponseData = await songApi().registerSong(data);
            await Swal.fire({
                title: response.status ? "Success!" : "Error!",
                text: response.message,
                icon: response.status ? "success" : "error",
            });

            return {
                "@key": response["@key"],
                status: response.status,
                message: response.message
            };
        }

        if (tag.toLowerCase() === "playlist") {
            const data: any = {
                name: formData.name,
                songs: formData.songs,
                private: formData.private,
            };

            const response: ResponseData = await playlistApi().createPlaylist(data);
            await Swal.fire({
                title: response.status ? "Success!" : "Error!",
                text: response.message,
                icon: response.status ? "success" : "error",
            });

            return {
                "@key": response["@key"],
                status: response.status,
                message: response.message
            };
        }

        if (tag.toLowerCase() === "playlist_add_song") {
            const data: any = {
                idPlaylist: formData.idPlaylist,
                songs: formData.songs
            };

            const response: ResponseData = await playlistApi().addNewSoundsToPlaylist(data);
            await Swal.fire({
                title: response.status ? "Success!" : "Error!",
                text: response.message,
                icon: response.status ? "success" : "error",
            });

            return {
                "@key": response["@key"],
                status: response.status,
                message: response.message
            };
        }

        return {
            status: false,
            message: "Process not found."
        }
    } catch (error: any) {
        console.error(error);
        await Swal.fire({
            title: "Error!",
            text: error.response?.message || "Internal error.",
            icon: "error"
        });

        return {
            status: false,
            message: error.response?.message || "Internal error."
        }
    }
};
