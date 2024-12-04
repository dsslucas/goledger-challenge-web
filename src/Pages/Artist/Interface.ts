export interface ArtistPageInterface {

}

export interface Artist {
    "@assetType": string;
    "@key": string;
    "@lastTouchBy": string;
    "@lastTx": string;
    "@lastUpdated": string;
    country: string;
    name: string;
    albuns: Album[];
}

export interface Album {
    "@assetType": string;
    "@key": string;
    "@lastTouchBy": string;
    "@lastTx": string;
    "@lastUpdated": string;
    artist: Artist;
    name: string;
    year: number;
    songs: Song[];
}

export interface Song {
    "@assetType": string;
    "@key": string;
    "@lastTouchBy": string;
    "@lastTx": string;
    "@lastUpdated": string;
    album: Album;
    name: string;
}