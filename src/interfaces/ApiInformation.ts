import { InputField } from "../components/Input/Interface";

export interface ApiInformation {
    assetType: string;
    "@key": string;
    key: string;
    lastTouchBy: string;
    lastTx: string;
    lastUpdated: string;
    country?: string;
    name: string;
    year?: number;
    artist?: ApiInformation;
    album?: ApiInformation;
    albuns?: ApiInformation[];
    songs?: ApiInformation[];
    private?: boolean;
}

export interface ArtistSend {
    name: string;
    country: string;
}

export interface AlbumSend {
    idArtist: string;
    name: string;
    year: string;
    songs: InputField[];
}

export interface SongSend {
    idAlbum: string;
    songs: InputField[];
}

export interface PlaylistSend {
    name: string;
    songs: InputField[];
    private: boolean;
    idPlaylist?: string;
}