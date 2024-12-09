import { ModalCreateInputInterface } from "../Pages/Modal/Interface";
import artistApi from "../api/artists";
import albumApi from "../api/album";
import songApi from "../api/song";
import playlistApi from "../api/playlist";
import { ResponseData } from "../interfaces/ApiInformation";
import { sweetAlertHandler } from "./sweetAlertHandler";

export const handleConfirmModalAdd = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string): Promise<ResponseData> => {
    event.preventDefault();

    const returnResponse = async (status: boolean, text: string, key?: string) => {
        await sweetAlertHandler(
            status ? "Success!" : "Error!",
            text,
            status ? "success" : "error",
            () => null,
            () => null,
        false);

        return {
            status: status,
            message: text,
            "@key": key
        }
    }

    if (!formData) {
        return returnResponse(false, "Internal error.");
    }

    try {
        if (tag.toLowerCase() === "artist") {
            if (!formData?.name) {
                return returnResponse(false, "You should inform the artist name.");
            }

            if (!formData?.country) {
                return returnResponse(false, "You should inform the country of artist.");
            }

            const data = {
                name: formData.name,
                country: formData.country,
            };

            const response: ResponseData = await artistApi().postNewArtist(data);
            return returnResponse(response.status, response.message);
        }

        if (tag.toLowerCase() === "album") {
            const data: any = {
                idArtist: formData.idArtist,
                name: formData.name,
                year: formData.year,
                songs: formData.songs,
            };

            const response: ResponseData = await albumApi().registerNewAlbum(data);
            return returnResponse(response.status, response.message);
        }

        if (tag.toLowerCase() === "song") {
            const data: any = {
                idAlbum: formData.idAlbum,
                songs: formData.songs,
            };

            const response: ResponseData = await songApi().registerSong(data);
            return returnResponse(response.status, response.message, (response["@key"])?.toString());
        }

        if (tag.toLowerCase() === "playlist") {
            const data: any = {
                name: formData.name,
                songs: formData.songs,
                private: formData.private,
            };

            const response: ResponseData = await playlistApi().createPlaylist(data);
            return returnResponse(response.status, response.message, (response["@key"])?.toString());
        }

        if (tag.toLowerCase() === "playlist_add_song") {
            const data: any = {
                idPlaylist: formData.idPlaylist,
                songs: formData.songs
            };

            const response: ResponseData = await playlistApi().addNewSoundsToPlaylist(data);
            return returnResponse(response.status, response.message, (response["@key"])?.toString());
        }

        return {
            status: false,
            message: "Process not found."
        }
    } catch (error: any) {
        console.error(error);
        return returnResponse(false, error.response?.message || "Internal error.");
    }
};
