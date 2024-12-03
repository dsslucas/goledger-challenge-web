import { ApiInformation } from "../interfaces/ApiInformation";
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

            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao buscar artista:", error);
            return [];
        }
    }

    return {
        getAllArtists,
        getArtistInfo
    }
}

export default getArtist;