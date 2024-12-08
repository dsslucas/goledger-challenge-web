import { ApiInformation } from "../../interfaces/ApiInformation";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";

export interface DetailContentInterface {
    externalData: ApiInformation;
    type: string;
    loading: boolean;
    paramsModalCreate: ModalCreateInterface;
    handleSendModal: (e: React.FormEvent, data: ModalCreateInputInterface) => void;

    // COMMON FUNCTIONS
    handleDeleteSong: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;

    // ARTIST
    handleChangeCountryState?: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
    handleClickChangeArtistLocation?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;
    handleClickDeleteArtist?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;
    handleAddAlbum?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;
    handleChangeAlbumYear?: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
    handleClickChangeAlbumYear?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;
    handleDeleteAlbum?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;

    // SONG
    handleAddSong?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;

    // PLAYLIST
    handleChangePrivate?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeletePlaylist?: (event: React.MouseEvent<HTMLButtonElement>, key: string) => void;
}