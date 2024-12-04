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