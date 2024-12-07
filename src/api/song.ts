import { InputField } from "../components/Input/Interface";
import { ApiInformation, SongSend } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";
import getArtist from "./artists";
import playlistApi from "./playlist";

const songApi = () => {
    const registerSong = async (request: SongSend) => {
        try {
            if (request.idAlbum === null || request.idAlbum === undefined || request.idAlbum === "") throw "NO_ALBUM";
            if (request.songs === null || request.songs === undefined || request.songs.length === 0) throw "NO_SONG";
            if (request.songs.some((element: InputField) => element.value === "" || element.value === null || element.value === undefined)) throw "NO_SONG_NAME";

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
                    "@assetType": element["@assetType"],
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
                        "@assetType": "song",
                        "album": {
                            "@assetType": "album",
                            "@key": id
                        }
                    }
                }
            });

            return response.data.result;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const deleteSong = async (idSong: string) => {
        try {
            return await api.post("/invoke/deleteAsset", {
                key: {
                    "@assetType": "song",
                    "@key": idSong
                }
            }).then((response: any) => {
                return {
                    status: true,
                    message: "Song deleted successfully from database."
                };
            });
        }
        catch (error){
            console.error(error);
            return {
                status: false,
                message: "Error on song delete."
            };
        }
    }

    const deleteSongHandler = async (idSong: string) => {
        console.log("ID NA EXCLUSAO DO SONG: ", idSong)
        try {
            if (idSong === null || idSong === undefined || idSong == "") throw "NO_ID";
    
            const existSongOnPlaylist = await playlistApi().getAllPlaylists()
                .then((response: any) => {
                    return response.filter((element: any) =>
                        element.songs.some((song: ApiInformation) => song["@key"] === idSong)
                    );
                });
    
            if (Array.isArray(existSongOnPlaylist) && existSongOnPlaylist.length > 0) {
                for (let i = 0; i < existSongOnPlaylist.length; i++) {
                    const element = existSongOnPlaylist[i];
                    console.log(element["@key"]);
                    await playlistApi().deletePlaylistSong(element["@key"], idSong);
                }

                const responseDeleteSong = await deleteSong(idSong);
                return responseDeleteSong;
            } else {
                const responseDeleteSong = await deleteSong(idSong);
                return responseDeleteSong;
            }
        } catch (error) {
            console.error(error);
            var message = "Error on delete song.";
            if (error === "NO_ID") message = "No id found for delete song.";
    
            return {
                status: false,
                message: message
            };
        }
    };

    return {
        registerSong,
        getAllSongs,
        getSongInfo,
        getSongsByAlbumId,
        deleteSongHandler
    }
}

export default songApi;