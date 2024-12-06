import Swal from "sweetalert2";
import { ModalCreateInputInterface } from "../Pages/Modal/Interface";
import artistApi from "../api/artists";
import albumApi from "../api/album";
import songApi from "../api/song";
import playlistApi from "../api/playlist";
import { AlbumSend } from "../interfaces/ApiInformation";

export const handleConfirmModalAdd = async (event: React.FormEvent, formData: ModalCreateInputInterface, tag: string): Promise<boolean> => {
    event.preventDefault();

    if (!formData) {
        await Swal.fire({
            title: "Erro!",
            text: "Internal error.",
            icon: "error"
        });
        return false;
    }

    try {
        if (tag.toLowerCase() === "artist") {
            if (!formData?.name) {
                await Swal.fire({
                    title: "Erro!",
                    text: "Informe o nome do artista.",
                    icon: "error"
                });
                return false;
            }

            if (!formData?.country) {
                await Swal.fire({
                    title: "Erro!",
                    text: "Informe o país do artista.",
                    icon: "error"
                });
                return false;
            }

            const data = {
                name: formData.name,
                country: formData.country,
            };

            const response = await artistApi().postNewArtist(data);
            await Swal.fire({
                title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                text: response.message,
                icon: response.positiveConclusion ? "success" : "error",
            });

            return response.positiveConclusion;
        }

        if (tag.toLowerCase() === "album") {
            const data: any = {
                idArtist: formData.idArtist,
                name: formData.name,
                year: formData.year,
                songs: formData.songs,
            };

            const response = await albumApi().registerNewAlbum(data);
            await Swal.fire({
                title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                text: response.message,
                icon: response.positiveConclusion ? "success" : "error",
            });

            return response.positiveConclusion;
        }

        if (tag.toLowerCase() === "song") {
            const data: any = {
                idAlbum: formData.idAlbum,
                songs: formData.songs,
            };

            const response = await songApi().registerSong(data);
            await Swal.fire({
                title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                text: response.message,
                icon: response.positiveConclusion ? "success" : "error",
            });

            return response.positiveConclusion;
        }

        if (tag.toLowerCase() === "playlist") {
            const data: any = {
                name: formData.name,
                songs: formData.songs,
                private: formData.private,
            };

            const response = await playlistApi().createPlaylist(data);
            await Swal.fire({
                title: response.positiveConclusion ? "Sucesso!" : "Erro!",
                text: response.message,
                icon: response.positiveConclusion ? "success" : "error",
            });

            return response.positiveConclusion;
        }

        return false;
    } catch (error: any) {
        console.error(error);
        await Swal.fire({
            title: "Erro!",
            text: error.response?.message || "Ocorreu um erro inesperado.",
            icon: "error"
        });
        return false;
    }
};
