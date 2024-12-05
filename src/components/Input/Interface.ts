export interface InputInterface {
    placeholder?: string;
    type: string;
    value?: string | number;
    checked?: boolean;
    id: string;
    name: string;
    rounded?: boolean;
    border?: boolean;
    backgroundTransparent?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    width36?: boolean
}

export interface InputField {
    id: number;
    value: string;
}