import { InputField } from "../components/Input/Interface";
import { ApiInformation, PlaylistSend } from "../interfaces/ApiInformation";
import albumApi from "./album";
import api from "./api";
import songApi from "./song";
import getSong from "./song";

const playlistApi = () => {
    const createPlaylist = async (request: PlaylistSend) => {
        try {
            if (request.name === null || request.name === undefined || request.name === "") throw "NO_NAME";
            if (request.private === null || request.private === undefined) throw "NO_PRIVATE";

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

            await api.post("/invoke/createAsset", payload);

            return {
                positiveConclusion: true,
                message: "Playlist registrada!"
            }
        }
        catch (error: any) {
            console.error(error.response.data)
            if (error === "NO_NAME") return {
                positiveConclusion: false,
                message: "É necessário informar o nome da playlist."
            };
            else if (error === "NO_PRIVATE") return {
                positiveConclusion: false,
                message: 'O dado "privado" não foi informada.'
            }
            else return {
                positiveConclusion: false,
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
                if(response.data && response.data.result){
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
            if (id === null || id === undefined || id == "") throw "NO_ID";

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

                        element.artist = artist
                        element.album = getAlbum
                    }
                }

                return response.data;
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
            if (request === null || request === undefined) throw "NO_DATA";
            if (request.idPlaylist === null || request.idPlaylist === undefined || request.idPlaylist === "") throw "NO_PLAYLIST_ID";
            if (request.songs === null || request.songs === undefined || !Array.isArray(request.songs) || request.songs.length === 0) throw "NO_SONGS";

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

                await api.post("/invoke/updateAsset", {
                    "update": {
                        "@assetType": "playlist",
                        "@key": request.idPlaylist,
                        "songs": newSongs
                    }
                }).then((response: any) => {
                    console.log(response.data);
                    return response;
                })

                return {
                    status: true,
                    message: "Songs added!"
                };
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
            if (idPlaylist === null || idPlaylist === undefined || idPlaylist == "") throw "NO_PLAYLIST_ID";
            if (idSong === null || idSong === undefined || idSong == "") throw "NO_SONG_ID";

            const playlistData = await getPlaylistInfo(idPlaylist);
            var newSongs = [];
            if (playlistData.songs) {
                newSongs = playlistData.songs.filter((element: ApiInformation) => element["@key"] !== idSong)

                console.log(newSongs)

                await api.post("/invoke/updateAsset", {
                    "update": {
                        "@assetType": "playlist",
                        "@key": idPlaylist,
                        "songs": newSongs
                    }
                }).then((response: any) => {
                    console.log(response.data);
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
            if (idPlaylist === null || idPlaylist === undefined || idPlaylist == "") throw "NO_PLAYLIST_ID";

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
            if (id === null || id === undefined || id == "") throw "NO_ID";

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