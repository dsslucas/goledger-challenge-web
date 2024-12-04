import { ApiInformation } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";

const getArtist = () => {
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

    return {
        getAllArtists,
        getArtistInfo,
        updateCountryArtist
    }
}

export default getArtist;