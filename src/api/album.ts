import { InputField } from "../components/Input/Interface";
import { AlbumSend, ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";
import artistApi from "./artists";
import getArtist from "./artists";
import songApi from "./song";
import getSong from "./song";
import { generateThrow } from "./throw";

const albumApi = () => {
    const registerNewAlbum = async (request: AlbumSend) => {
        try {
            if (request.idArtist === null || request.idArtist === undefined || request.idArtist === "") throw generateThrow("NO_ARTIST");
            if (request.name === null || request.name === undefined || request.name === "") throw generateThrow("NO_NAME");
            if (request.year === null || request.year === undefined || request.year === "") throw generateThrow("NO_YEAR");
            if ((request.songs === null || request.songs === undefined || request.songs.length === 0) && (request.songs.some((element: InputField) => element.value === "" || element.value === null || element.value === undefined))) throw generateThrow("NO_SONG_NAME");

            return await api.post("/invoke/createAsset", {
                asset: [{
                    "@assetType": "album",
                    "name": request.name,
                    "artist": {
                        "@assetType": "artist",
                        "@key": request.idArtist
                    },
                    "year": Number(request.year)
                }]
            }).then(async (response: any) => {
                if (request.songs.length > 0) {
                    await songApi().registerSong({
                        idAlbum: response.data[0]["@key"],
                        songs: request.songs
                    })
                }
                
                return response;
            }).then((response: any) => {
                if(response.data && Array.isArray(response.data) && response.data.length > 0){
                    return {
                        status: true,
                        message: "Album registered!",
                        "@key": response.data[0]["@key"]
                    }
                }
                return {
                    status: true,
                    message: "Album registered!",
                    "@key": null
                }
            }).catch((error: any) => {
                console.error(error);
                return {
                    status: false,
                    message: "The artist isn't registered by error."
                }
            });
        }
        catch (error) {
            console.error(error)
            if (error === "NO_ARTIST") return {
                status: false,
                message: "You should inform the artist name."
            };
            else if (error === "NO_NAME") return {
                status: false,
                message: "You should inform the album name."
            }
            else if (error === "NO_YEAR") return {
                status: false,
                message: "You should inform the album year."
            }
            else if (error === "NO_SONG") return {
                status: false,
                message: "You should inform at least one song"
            }
            else if (error === "NO_SONG_NAME") return {
                status: false,
                message: "You should inform the song name"
            }
            else return {
                status: false,
                message: "Erro ao registrar álbum."
            };
        }
    }

    const getAllAlbums = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "album"
                    }
                }
            });

            var data: ApiInformation[] = [];
            for (let i = 0; i < response.data.result.length; i++) {
                const element = response.data.result[i];

                const artist: any = await getArtist().getArtistInfo(element.artist["@key"]);

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
                    artist: artist
                })
            }

            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getAlbumById = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "album",
                    "@key": id
                }
            })
                .then(async (response: any) => {
                    const idArtist = response.data.artist["@key"];
                    const artistInfo = await artistApi().getArtistInfo(idArtist);
                    response.data.artist.name = artistInfo.name;
                    return response;
                }).then(async (response: any) => {
                    const songs = await songApi().getSongsByAlbumId(response.data["@key"]);
                    response.data.songs = songs;
                    return response;
                });

            return response.data;
        }
        catch (error) {
            console.error(error);
            var message = "Error on get album.";
            if (error === "NO_ID") message = "No id found for getting album data.";

            return {
                status: false,
                message: message
            };
        }
    }

    const getAlbunsByArtistId = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "album",
                        "artist": {
                            "@assetType": "artist",
                            "@key": id
                        }
                    }
                }
            }).then((response: any) => {
                response.data.result.forEach(async (element: any) => {
                    element.songs = await getSong().getSongsByAlbumId(element["@key"]);
                })
                return response.data.result;
            });

            return response;
        }
        catch (error) {
            console.error(error);
            var message = "Error on get album.";
            if (error === "NO_ID") message = "No id found for getting data.";

            return {
                status: false,
                message: message
            };
        }
    }

    const updateYearAlbum = async (id: string, value: number) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");
            if (value === null || value === undefined) throw generateThrow("NO_VALUE");

            return await api.post("/invoke/updateAsset", {
                "update": {
                    "@assetType": "album",
                    "@key": id,
                    "year": Number(value)
                }
            }).then(() => {
                return {
                    status: true,
                    message: "Year updated."
                };
            }).catch((error: any) => {
                console.error(error)
                return {
                    status: false,
                    message: "Error during year update."
                };
            });            
        }
        catch (error) {
            console.error(error);

            var message = "Error on delete album.";
            if (error === "NO_ID") message = "No id found for update.";
            if (error === "NO_VALUE") message = "The value is not given for update.";

            return {
                status: false,
                message: message
            };
        }
    }

    const deleteAlbum = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            await getAlbumById(id).then(async (response: ApiInformation) => {
                if (!response.songs) throw generateThrow("NO_SOUNDS");

                for (let i = 0; i < response.songs.length; i++) {
                    const element = response.songs[i];
                    await songApi().deleteSongHandler(element["@key"]);
                }
                return response;
            }).then(async () => {
                await api.post("/invoke/deleteAsset", {
                    "key": {
                        "@assetType": "album",
                        "@key": id
                    }
                });
            });

            return {
                status: true,
                message: "Album deleted in this blockchain."
            };
        }
        catch (error) {
            var message = "Error on delete album.";
            if (error === "NO_ID") message = "No id found for delete album.";
            if (error === "NO_SOUNDS") message = "Sounds not found on this album.";

            return {
                status: false,
                message: message
            };
        }
    }

    return {
        registerNewAlbum,
        getAllAlbums,
        getAlbumById,
        getAlbunsByArtistId,
        updateYearAlbum,
        deleteAlbum
    }
}

export default albumApi;