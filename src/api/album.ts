import { ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";

const getAlbum = () => {
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
            });

            console.log(data);
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getAlbunsByArtist = async () => {
        
    }

    return {
        getAllAlbums,
        getAlbunsByArtist
    }
}

export default getAlbum;