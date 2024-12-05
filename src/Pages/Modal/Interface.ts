import { InputField } from "../../components/Input/Interface";
import { Option } from "../../components/Select/Interface";

export interface ModalCreateInterface {
    open: boolean;
    title: string;
    tag: string;

    onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    buttonConfirm?: boolean;
    buttonConfirmText?: string;
    onConfirm?: (event: React.FormEvent, formData: ModalCreateInputInterface) => void;
    submitData?: any;
    options?: Option[];
}

export interface ModalCreateInputInterface {
    name?: string;
    country?: string;
    year?: number;
    idArtist?: string;
    idAlbum?: string;
    songs?: InputField[];
}