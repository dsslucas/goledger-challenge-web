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

                const album = await getAlbum().getAlbumById(element.album["@key"]);
                const artist = await getArtist().getArtistInfo(album.artist["@key"]);

                data.push({
                    assetType: element["@assetType"],
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

            console.log(data)
            
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const getSongInfo = async (id: string) => {
        await api.post("/query/readAsset", {
            key: {
                "@assetType": "song",
                "@key": id
            }
        })
            .then((response: any) => {
                console.log(response.data)
            })

        const data = {
            artist: {

            },
            albuns: [{

            }],
            songs: [{

            }],
            playlist: [{

            }]
        };

    }

    return {
        getAllSongs,
        getSongInfo
    }
}

export default getSong;