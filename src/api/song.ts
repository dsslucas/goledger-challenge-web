import { randomImage } from "../common/randomImage";
import { InputField } from "../components/Input/Interface";
import { ApiInformation, SongSend } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";
import getArtist from "./artists";
import playlistApi from "./playlist";
import { generateThrow } from "./throw";

const songApi = () => {
    const registerSong = async (request: SongSend) => {
        try {
            if (request.idAlbum === null || request.idAlbum === undefined || request.idAlbum === "") throw generateThrow("NO_ALBUM");
            if (request.songs === null || request.songs === undefined || request.songs.length === 0) throw generateThrow("NO_SONG");
            if (request.songs.some((element: InputField) => element.value === "" || element.value === null || element.value === undefined)) throw generateThrow("NO_SONG_NAME");
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

            return await api.post("/invoke/createAsset", {
                asset: songs
            }).then(() => {
                return {
                    status: true,
                    message: "Song registered!",
                    "@key": request.idAlbum
                }
            }).catch((error: any) => {
                console.error(error);
                return {
                    status: false,
                    message: "The song isn't registered by error."
                }
            });
        }
        catch (error) {
            console.error(error)
            if (error === "NO_ALBUM") return {
                status: false,
                message: "You should inform the album."
            };
            else if (error === "NO_SONG") return {
                status: false,
                message: "You should inform at least one song"
            }
            else if (error === "NO_SONG_NAME") return {
                status: false,
                message: "One of songs not have name."
            }
            else return {
                status: false,
                message: "Error during song registration."
            };
        }
    }

    const getAllSongs = async () => {
        try {
            return await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "song"
                    }
                }
            }).then(async (response: any) => {
                var data: ApiInformation[] = [];
                if(response.data && response.data.result){
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
                            album: album,
                            image: randomImage()
                        })
                    }
                }

                return data;
            }).catch((error: any) => {
                console.error(error);
                return [];
            });
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
            console.error("Error:", error);
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
                    message: "Song deleted successfully."
                };
            });
        }
        catch (error) {
            console.error(error);
            return {
                status: false,
                message: "Error on song delete."
            };
        }
    }

    const deleteSongHandler = async (idSong: string) => {
        try {
            if (idSong === null || idSong === undefined || idSong === "") throw generateThrow("NO_ID");

            const existSongOnPlaylist = await playlistApi().getAllPlaylists()
                .then((response: any) => {
                    return response.filter((element: any) =>
                        element.songs.some((song: ApiInformation) => song["@key"] === idSong)
                    );
                });

            if (Array.isArray(existSongOnPlaylist) && existSongOnPlaylist.length > 0) {
                for (let i = 0; i < existSongOnPlaylist.length; i++) {
                    const element = existSongOnPlaylist[i];
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