import { ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";
import getArtist from "./artists";

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
            for(let i=0; i < response.data.result.length; i++){
                const element = response.data.result[i];

                const artist: any = await getArtist().getArtistInfo(element.artist["@key"]);
                console.log(artist)

                data.push({
                    assetType: element["@assetType"],
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
            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "album",
                    "@key": id
                }
            });
            
            return response.data;
        }
        catch (error) {
            console.error("Erro ao buscar album:", error);
            return [];
        }
    }

    return {
        getAllAlbums,
        getAlbumById
    }
}

export default getAlbum;