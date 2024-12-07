import { ApiInformation, ArtistSend } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";

const artistApi = () => {
    const postNewArtist = async (request: ArtistSend) => {
        try {
            if (request.name === null || request.name === undefined || request.name === "") throw "NO_NAME";
            if (request.country === null || request.country === undefined || request.country === "") throw "NO_COUNTRY";

            await api.post("/invoke/createAsset", {
                asset: [{
                    "@assetType": "artist",
                    "name": request.name,
                    "country": request.country
                }]
            });

            return {
                positiveConclusion: true,
                message: "Artista registrado!"
            }
        }
        catch (error) {
            console.error(error)
            if (error === "NO_NAME") return {
                positiveConclusion: false,
                message: "É necessário informar o nome do artista."
            };
            else if (error === "NO_COUNTRY") return {
                positiveConclusion: false,
                message: "É necessário informar o país do artista."
            };
            else return {
                positiveConclusion: false,
                message: "Erro ao registrar artista." 
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
            if (id === null || id === undefined || id == "") throw "NO_ID";

            await api.post("/invoke/deleteAsset", {
                "key": {
                    "@assetType": "artist",
                    "@key": id
                },
                "cascade": true
            });

            return {
                status: true,
                message: "Artist deleted."
            };
        }
        catch (error) {
            var message = "Error on delete artist.";
            if (error === "NO_ID") message = "No id found for delete.";

            return {
                status: false,
                message: message
            };
        }
    }

    return {
        postNewArtist,
        getAllArtists,
        getArtistInfo,
        updateCountryArtist,
        deleteArtist
    }
}

export default artistApi;