import { InputField } from "../components/Input/Interface";
import { ApiInformation, SongSend } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";
import getArtist from "./artists";

const songApi = () => {
    const registerSong = async (request: SongSend) => {
        try {            
            if (request.idAlbum === null || request.idAlbum === undefined || request.idAlbum === "") throw "NO_ALBUM";
            if (request.songs === null || request.songs === undefined || request.songs.length === 0) throw "NO_SONG";
            if(request.songs.some((element: InputField) => element.value === "" || element.value === null || element.value === undefined)) throw "NO_SONG_NAME";

            const songs = request.songs.map((song: InputField) => {
                return {
                    "@assetType": "song",
                    "name": song.value,
                    "album": {
                        "@assetType": "album",
                        "@key": request.idAlbum
                    }
                }
            })

            await api.post("/invoke/createAsset", {
                asset: songs
            })

            return {
                positiveConclusion: true,
                message: "Som registrado!"
            }
        }
        catch (error) {
            console.error(error)
            if (error === "NO_ALBUM") return {
                positiveConclusion: false,
                message: "É necessário informar o álbum."
            };
            else if (error === "NO_SONG") return {
                positiveConclusion: false,
                message: "É necessário informar pelo menos um som."
            }
            else if (error === "NO_SONG_NAME") return {
                positiveConclusion: false,
                message: "É necessário informar o nome do som"
            }            
            else return {
                positiveConclusion: false,
                message: "Erro ao registrar som."
            };
        }
    }

    const getAllSongs = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "song"
                    }
                }
            });

            var data: ApiInformation[] = [];
            for (let i = 0; i < response.data.result.length; i++) {
                const element = response.data.result[i];

                var album;
                if (element.album) {
                    album = await getAlbum().getAlbumById(element.album["@key"]);
                }

                var artist;
                if (album.artist) {
                    artist = await getArtist().getArtistInfo(album.artist["@key"]);
                }

                data.push({
                    assetType: element["@assetType"],
                    "@key": element["@key"],
                    key: element["@key"],
                    lastTouchBy: element["@lastTouchBy"],
                    lastTx: element["@lastTx"],
                    lastUpdated: element["@lastUpdated"],
                    country: element.country,
                    name: element.name,
                    year: element.year,
                    artist: artist,
                    album: album
                })
            }

            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getSongInfo = async (id: string) => {
        try {
            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "song",
                    "@key": id
                }
            });

            return response.data;
        }
        catch (error) {
            console.error("Erro ao buscar artista:", error);
            return [];
        }
    }

    const getSongsByAlbumId = async (id: string) => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "song"
                    }
                }
            }).then((response: any) => {
                return response.data.result.filter((element: any) => element.album["@key"] === id);
            });

            return response;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const deleteSong = async (id: string) => {
        try {
            const response = await api.delete("/invoke/deleteAsset", {
                data: {
                    key: {
                        "@assetType": "song",
                        "@key": id
                    }
                }
            }).then((response: any) => {
                console.log(response)
                return "Som deletado.";
            });

            return response;
        }
        catch (error) {
            console.error(error);
            return "Erro ao deletar a música do álbum.";
        }
    }

    return {
        registerSong,
        getAllSongs,
        getSongInfo,
        getSongsByAlbumId,
        deleteSong
    }
}

export default songApi;