import { ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";
import getArtist from "./artists";
import getSong from "./song";

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

    const getAlbunsByArtistId = async (id: string) => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "album"
                    }
                }
            }).then(async (response: any) => {
                // Filter by Artist ID
                return response.data.result.filter((element: any) => element.artist["@key"] === id);
            }).then((album: ApiInformation[]) => {
                album.forEach(async (element: any) => {                    
                    console.log(element["@key"])
                    element.songs = await getSong().getSongsByAlbumId(element["@key"]);
                })
                return album;
            });

            return response;
        }
        catch (error) {
            console.error("Erro ao buscar album:", error);
            return [];
        }
    }

    const updateYearAlbum = async (id: string, value: number) => {
        try {
            const response = await api.post("/invoke/updateAsset", {
                "update": {
                    "@assetType": "album",
                    "@key": id,
                    "year": Number(value)
                }
            });

            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar album:", error);
            return [];
        }
    }

    return {
        getAllAlbums,
        getAlbumById,
        getAlbunsByArtistId,
        updateYearAlbum
    }
}

export default getAlbum;