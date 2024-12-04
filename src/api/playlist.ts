import { ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";
import getSong from "./song";

const getPlaylist = () => {
    const getAllPlaylists = async () => {
        try {
            const response = await api.post("/query/search", {
                query: {
                    selector: {
                        "@assetType": "playlist"
                    }
                }
            });

            var data: ApiInformation[] = [];
            for(let i=0; i < response.data.result.length; i++){
                const element = response.data.result[i];
                const songs: ApiInformation[] = [];

                if(Array.isArray(element.songs)){
                    for(let j=0; j < element.songs.length; j++){
                        const eachSong = await getSong().getSongInfo(element["@key"]);
                        songs.push(eachSong);
                    }
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
                    songs: songs
                })
            }
            
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getPlaylistInfo = async (id: string) => {
        await api.post("/query/readAsset", {
            key: {
                "@assetType": "playlist",
                "@key": id
            }
        })
            .then((response: any) => {
            })

        // const data = {
        //     artist: {

        //     },
        //     albuns: [{

        //     }],
        //     songs: [{

        //     }],
        //     playlist: [{

        //     }]
        // };

    }

    return {
        getAllPlaylists,
        getPlaylistInfo
    }
}

export default getPlaylist;