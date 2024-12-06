import { InputField } from "../components/Input/Interface";
import { AlbumSend, ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";
import getArtist from "./artists";
import songApi from "./song";
import getSong from "./song";

const albumApi = () => {
    const registerNewAlbum = async (request: AlbumSend) => {
        try {
            if (request.idArtist === null || request.idArtist === undefined || request.idArtist === "") throw "NO_ARTIST";
            if (request.name === null || request.name === undefined || request.name === "") throw "NO_NAME";
            if (request.year === null || request.year === undefined || request.year === "") throw "NO_YEAR";
            // if (request.songs === null || request.songs === undefined || request.songs.length === 0) throw "NO_SONG";
            // if(request.songs.some((element: InputField) => element.value === "" || element.value === null || element.value === undefined)) throw "NO_SONG_NAME";

            await api.post("/invoke/createAsset", {
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
                    return await songApi().registerSong({
                        idAlbum: response.data[0]["@key"],
                        songs: request.songs
                    })
                }
                else {
                    return response.data.result;
                }
            });

            return {
                positiveConclusion: true,
                message: "Album registrado!"
            }
        }
        catch (error) {
            console.error(error)
            if (error === "NO_ARTIST") return {
                positiveConclusion: false,
                message: "É necessário informar o nome do artista."
            };
            else if (error === "NO_NAME") return {
                positiveConclusion: false,
                message: "É necessário informar o nome do álbum."
            }
            else if (error === "NO_YEAR") return {
                positiveConclusion: false,
                message: "É necessário informar o ano do álbum."
            }
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
            var message = "Error on get albuns.";
            return [];
            // return {
            //     status: false,
            //     message: message
            // };
        }
    }

    const getAlbumById = async (id: string) => {
        try {
            if (id === null || id === undefined || id == "") throw "NO_ID";

            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "album",
                    "@key": id
                }
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
            if (id === null || id === undefined || id == "") throw "NO_ID";

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
                console.log(response.data.result)
                response.data.result.forEach(async (element: any) => {
                    element.songs = await getSong().getSongsByAlbumId(element["@key"]);
                })
                return response.data.result;
            });

            console.log("RESULTADO: ", response)

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
            if (id === null || id === undefined || id == "") throw "NO_ID";
            if (value === null || value === undefined) throw "NO_VALUE";

            const response = await api.post("/invoke/updateAsset", {
                "update": {
                    "@assetType": "album",
                    "@key": id,
                    "year": Number(value)
                }
            });

            return {
                status: true,
                message: "Year updated."
            };
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
            if (id === null || id === undefined || id == "") throw "NO_ID";

            const response = await api.post("/invoke/deleteAsset", {
                "key": {
                    "@assetType": "album",
                    "@key": id
                },
                "cascade": true
            });

            return {
                status: true,
                message: "Album deleted."
            };
        }
        catch (error) {
            var message = "Error on delete album.";
            if (error === "NO_ID") message = "No id found for delete.";

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