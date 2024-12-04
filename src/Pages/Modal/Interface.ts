export interface ModalCreateInterface {
    title: string;
    tag: string;

    onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;

    buttonConfirm?: boolean;
    buttonConfirmText?: string;
    onConfirm?: (event: React.FormEvent) => void;
    submitData?: any;
}

export interface ModalCreateInputInterface {
    name?: string;
    country?: string;
}