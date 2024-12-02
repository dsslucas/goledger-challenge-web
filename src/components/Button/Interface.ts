export interface ButtonInterface {
    children: React.ReactNode;
    active?: boolean;
    key: number;
    width25Percent?: boolean;
    border?: boolean;
    rounded?: boolean;
    paddingX2?: boolean;

    borderColorHover?: string;
}