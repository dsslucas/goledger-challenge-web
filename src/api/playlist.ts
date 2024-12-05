import { InputField } from "../components/Input/Interface";
import { ApiInformation, PlaylistSend } from "../interfaces/ApiInformation";
import api from "./api";
import getSong from "./song";

const playlistApi = () => {
    const createPlaylist = async (request: PlaylistSend) => {
        try {
            if (request.name === null || request.name === undefined || request.name === "") throw "NO_NAME";
            if (request.private === null || request.private === undefined) throw "NO_PRIVATE";

            const songs = request.songs.map((song: InputField) => {
                return {
                    "@assetType": "song",
                    "@key": song.value
                }
            })

            const payload = {
                "asset": [{
                    "@assetType": "playlist",
                    "name": request.name,
                    "private": request.private,
                    "songs": songs
                }]
            }

            await api.post("/invoke/createAsset", payload);

            return {
                positiveConclusion: true,
                message: "Playlist registrada!"
            }
        }
        catch (error: any) {
            console.error(error.response.data)
            if (error === "NO_NAME") return {
                positiveConclusion: false,
                message: "É necessário informar o nome da playlist."
            };
            else if (error === "NO_PRIVATE") return {
                positiveConclusion: false,
                message: 'O dado "privado" não foi informada.'
            }
            else return {
                positiveConclusion: false,
                message: "Erro ao registrar playlist."
            };
        }
    }

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
            for (let i = 0; i < response.data.result.length; i++) {
                const element = response.data.result[i];
                const songs: ApiInformation[] = [];

                if (Array.isArray(element.songs)) {
                    for (let j = 0; j < element.songs.length; j++) {
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
        createPlaylist,
        getAllPlaylists,
        getPlaylistInfo
    }
}

export default playlistApi;