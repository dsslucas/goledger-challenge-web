export interface ApiInformation {
    assetType: string;
    key: string;
    lastTouchBy: string;
    lastTx: string;
    lastUpdated: string;
    country: string;
    name: string;
    year?: number;
    artist?: ApiInformation
}