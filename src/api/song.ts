import { ApiInformation } from "../interfaces/ApiInformation";
import getAlbum from "./album";
import api from "./api";
import getArtist from "./artists";

const getSong = () => {
    const getAllSongs = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "song"
                    }
                }
            });

            var data: ApiInformation[] = [];
            for(let i=0; i < response.data.result.length; i++){
                const element = response.data.result[i];

                var album;                
                if(element.album){
                    album = await getAlbum().getAlbumById(element.album["@key"]);
                }

                var artist;
                if(album.artist){
                    artist = await getArtist().getArtistInfo(album.artist["@key"]);
                }

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
                    artist: artist,
                    album: album
                })
            }
         
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getSongInfo = async (id: string) => {
        try {
            const response = await api.post("/query/readAsset", {
                key: {
                    "@assetType": "song",
                    "@key": id
                }
            });

            return response.data;
        }
        catch (error) {
            console.error("Erro ao buscar artista:", error);
            return [];
        }
    }

    const getSongsByAlbumId = async (id: string) => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "song"
                    }
                }
            }).then((response: any) => {
                return response.data.result.filter((element: any) => element.album["@key"] === id);
            });
         
            return response;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    return {
        getAllSongs,
        getSongInfo,
        getSongsByAlbumId
    }
}

export default getSong;