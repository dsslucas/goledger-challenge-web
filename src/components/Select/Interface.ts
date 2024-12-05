export interface SelectInterface {
    id: string;
    value?: string;
    name: string;
    options: Option[] | undefined;

    rounded?: boolean;
    border?: boolean;
    backgroundTransparent?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface Option {
    value: string;
    label: string;
  }