import { ApiInformation } from "../interfaces/ApiInformation";
import api from "./api";

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