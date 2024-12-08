import { ApiInformation, ArtistSend } from "../interfaces/ApiInformation";
import albumApi from "./album";
import getAlbum from "./album";
import api from "./api";
import { generateThrow } from "./throw";

const artistApi = () => {
    const postNewArtist = async (request: ArtistSend) => {
        try {
            if (request.name === null || request.name === undefined || request.name === "") throw generateThrow("NO_NAME");
            if (request.country === null || request.country === undefined || request.country === "") throw generateThrow("NO_COUNTRY");

            return await api.post("/invoke/createAsset", {
                asset: [{
                    "@assetType": "artist",
                    "name": request.name,
                    "country": request.country
                }]
            }).then((response: any) => {
                if(response.data && Array.isArray(response.data) && response.data.length > 0){
                    return {
                        status: true,
                        message: "Artist registered!",
                        "@key": response.data[0]["@key"]
                    }
                }
                return {
                    status: true,
                    message: "Artist registered!",
                    "@key": null
                }                
            }).catch((error: any) => {
                return {
                    status: false,
                    message: "The artist isn't registered by error."
                }
            });
        }
        catch (error) {
            console.error(error)
            if (error === "NO_NAME") return {
                status: false,
                message: "You should inform the name of artist."
            };
            else if (error === "NO_COUNTRY") return {
                status: false,
                message: "You should inform the country of artist."
            };
            else return {
                status: false,
                message: "Error while artist register."
            };
        }
    }

    const getAllArtists = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "artist"
                    }
                }
            });

            var data: ApiInformation[] = [];
            response.data.result.forEach((element: any) => {
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
                    year: element.year
                })
            })

            return data;
        }
        catch (error) {
            console.error("Erro ao buscar artistas:", error);
            return [];
        }
    }

    const getArtistInfo = async (id: string) => {
        try {
            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "artist",
                    "@key": id
                }
            });

            const albuns = await getAlbum().getAlbunsByArtistId(id);

            var data = {
                ...response.data,
                albuns: albuns
            }

            return data;
        }
        catch (error) {
            console.error("Erro ao buscar artista:", error);
            return [];
        }
    }

    const updateCountryArtist = async (id: string, value: string) => {
        try {
            const response = await api.post("/invoke/updateAsset", {
                "update": {
                    "@assetType": "artist",
                    "@key": id,
                    "country": value
                }
            });

            return response.data;
        }
        catch (error) {
            console.error("Erro ao buscar artista:", error);
            return [];
        }
    }

    const deleteArtist = async (id: string) => {
        try {
            if (id === null || id === undefined || id === "") throw generateThrow("NO_ID");

            await albumApi().getAlbunsByArtistId(id)
                .then(async (response: ApiInformation[]) => {
                    if (Array.isArray(response) && response.length > 0) {
                        for (let i = 0; i < response.length; i++) {
                            const album = response[i];
                            await albumApi().deleteAlbum(album["@key"]);
                        }
                    }
                    return response;
                })
                .then(async () => {
                    await api.post("/invoke/deleteAsset", {
                        "key": {
                            "@assetType": "artist",
                            "@key": id
                        }
                    })
                });

            return {
                status: true,
                message: "Artist deleted successfully."
            };
        } catch (error) {
            // Retorno de erro com mensagens específicas
            let message = "Error on deleting artist.";
            if (error === "NO_ID") message = "No ID provided for deletion.";
            else if (error === "NO_ALBUNS") message = "No albums found for deletion.";

            return {
                status: false,
                message: message
            };
        }
    };


    return {
        postNewArtist,
        getAllArtists,
        getArtistInfo,
        updateCountryArtist,
        deleteArtist
    }
}

export default artistApi;