import { InputField } from "../components/Input/Interface";
import { ApiInformation, PlaylistSend } from "../interfaces/ApiInformation";
import albumApi from "./album";
import api from "./api";
import songApi from "./song";
import { generateThrow } from "./throw";
import { randomImage } from "../common/randomImage";

const playlistApi = () => {
    const createPlaylist = async (request: PlaylistSend) => {
        try {
            if (request.name === null || request.name === undefined || request.name === "") throw generateThrow("NO_NAME");
            if (request.private === null || request.private === undefined) throw generateThrow("NO_PRIVATE");

            const songs = request.songs.map((song: InputField) => {
                return {
                    "@assetType": "song",
                    "@key": song.value
                }
            })

            const payload = {
                "asset": [{
                    "@assetType": "playlist",
                    "name": request.name,
                    "private": request.private,
                    "songs": songs
                }]
            }

            return await api.post("/invoke/createAsset", payload)
                .then((response: any) => {
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        return {
                            status: true,
                            message: "Playlist registered!",
                            "@key": response.data[0]["@key"]
                        }
                    }
                    return {
                        status: true,
                        message: "Playlist registered!",
                        "@key": null
                    }
                }).catch((error: any) => {
                    console.error(error);
                    return {
                        status: false,
                        message: "The playlist isn't registered by error."
                    }
                });
        }
        catch (error: any) {
            console.error(error.response.data)
            if (error === "NO_NAME") return {
                status: false,
                message: "É necessário informar o nome da playlist."
            };
            else if (error === "NO_PRIVATE") return {
                status: false,
                message: 'O dado "privado" não foi informada.'
            }
            else return {
                status: false,
                message: "Erro ao registrar playlist."
            };
        }
    }

    const getAllPlaylists = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "playlist"
                    }
                }
            }).then((response: any) => {
                if (response.data && response.data.result) {
                    const result = response.data?.result;

                    return result;
                }
                else return [];
            });

            return response;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getPlaylistInfo = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            return await api.post("/query/readAsset", {
                key: {
                    "@assetType": "playlist",
                    "@key": id
                }
            }).then(async (response: any) => {
                if (response.data && response.data.songs) {
                    for (let i = 0; i < response.data.songs.length; i++) {
                        const element = response.data.songs[i];
                        const getSongDetail = await songApi().getSongInfo(element["@key"]);
                        element.name = await getSongDetail.name;
                        const getAlbum = await albumApi().getAlbumById(getSongDetail.album["@key"])
                        const artist = getAlbum.artist;
                        element.artist = artist;
                        element.album = getAlbum;                        
                    }                    
                }
                response.data.image = randomImage();

                return response.data;
            }).catch((error: any) => {
                console.error(error);
                return null;
            })
        }
        catch (error: any) {
            console.error(error);
            var message = "Error on get playlist.";
            if (error === "NO_ID") message = "No id found for getting playlist data.";
            if (error === "ERROR_DEFINE_ALBUNS") message = "Error during album search";
            return {
                status: false,
                message: message
            };
        }
    }

    const addNewSoundsToPlaylist = async (request: PlaylistSend) => {
        try {
            if (request === null || request === undefined) throw generateThrow("NO_DATA");
            if (request.idPlaylist === null || request.idPlaylist === undefined || request.idPlaylist === "") throw generateThrow("NO_PLAYLIST_ID");
            if (request.songs === null || request.songs === undefined || !Array.isArray(request.songs) || request.songs.length === 0) throw generateThrow("NO_SONGS");

            const playlistData = await getPlaylistInfo(request.idPlaylist);
            var newSongs: any = [];
            if (playlistData.songs) {
                newSongs = [...playlistData.songs];

                request.songs.forEach((element: InputField) => {
                    const alreadyExists = playlistData.songs.some((item: any) => item["@key"] === element.value);

                    if (!alreadyExists) {
                        newSongs.push({
                            "@assetType": "song",
                            "@key": element.value
                        });
                    }
                });

                return await api.post("/invoke/updateAsset", {
                    "update": {
                        "@assetType": "playlist",
                        "@key": request.idPlaylist,
                        "songs": newSongs
                    }
                }).then((response: any) => {
                    return {
                        status: true,
                        message: "Playlist song registered!",
                        "@key": null
                    }
                }).catch((error: any) => {
                    console.error(error);
                    return {
                        status: false,
                        message: "The new playlist song isn't registered by error."
                    }
                });
            }

            return {
                status: false,
                message: "Songs not added to playlist."
            };
        }
        catch (error: any) {
            console.error(error);
            var message = "Error on post new songs to playlist.";
            if (error === "NO_DATA") message = "Request body not provided.";
            if (error === "NO_PLAYLIST_ID") message = "Playlist ID not found.";
            if (error === "NO_SONGS") message = "Songs not informated.";
            return {
                status: false,
                message: message
            };
        }
    }

    const deletePlaylistSong = async (idPlaylist: string, idSong: string) => {
        try {
            if (idPlaylist === null || idPlaylist === undefined || idPlaylist === "") throw generateThrow("NO_PLAYLIST_ID");
            if (idSong === null || idSong === undefined || idSong === "") throw generateThrow("NO_SONG_ID");

            const playlistData = await getPlaylistInfo(idPlaylist);
            var newSongs = [];
            if (playlistData.songs) {
                newSongs = playlistData.songs.filter((element: ApiInformation) => element["@key"] !== idSong)

                await api.post("/invoke/updateAsset", {
                    "update": {
                        "@assetType": "playlist",
                        "@key": idPlaylist,
                        "songs": newSongs
                    }
                }).then((response: any) => {
                    return response;
                })

                return {
                    status: true,
                    message: "Song removed!"
                };
            }

            return {
                status: false,
                message: "Song not removed on this playlist."
            };
        }
        catch (error: any) {
            console.error(error);
            var message = "Error on delete playlist song.";
            if (error === "NO_PLAYLIST_ID") message = "No playlist id found for delete playlist song.";
            if (error === "NO_SONG_ID") message = "No song id found for delete playlist song.";

            return {
                status: false,
                message: message
            };
        }
    }

    const updatePrivateStatus = async (idPlaylist: string) => {
        try {
            if (idPlaylist === null || idPlaylist === undefined || idPlaylist === "") throw generateThrow("NO_PLAYLIST_ID");

            const playlistData = await getPlaylistInfo(idPlaylist);

            if (playlistData) {
                await api.post("/invoke/updateAsset", {
                    "update": {
                        "@assetType": "playlist",
                        "@key": idPlaylist,
                        "private": playlistData.private
                    }
                }).then((response: any) => {
                    return response;
                })

                return {
                    status: true,
                    message: "Private status updated!"
                };
            }

            return {
                status: false,
                message: "Private status not updated on this playlist."
            };
        }
        catch (error: any) {
            console.error(error);
            var message = "Error on update private status on this playlist.";
            if (error === "NO_PLAYLIST_ID") message = "No playlist id found for update playlist private status.";

            return {
                status: false,
                message: message
            };
        }
    }

    const deletePlaylist = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            await api.post("/invoke/deleteAsset", {
                "key": {
                    "@assetType": "playlist",
                    "@key": id
                },
                "tag": "cascade"
            })

            return {
                status: true,
                message: "Playlist deleted!"
            };
        }
        catch (error: any) {
            console.error(error);
            var message = "Error on delete playlist.";
            if (error === "NO_ID") message = "No id found for delete playlist.";

            return {
                status: false,
                message: message
            };
        }
    }

    return {
        createPlaylist,
        getAllPlaylists,
        getPlaylistInfo,
        addNewSoundsToPlaylist,
        updatePrivateStatus,
        deletePlaylistSong,
        deletePlaylist
    }
}

export default playlistApi;