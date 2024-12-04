export interface InputInterface {
    placeholder?: string;
    type: string;
    value?: string | number;

    rounded?: boolean;
    border?: boolean;
    backgroundTransparent?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}