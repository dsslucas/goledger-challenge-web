export interface ButtonInterface {
    children: React.ReactNode;
    flex?: boolean;
    flexColumn?: boolean;
    widthFull?: boolean;
    active?: boolean;
    key?: number;
    width25Percent?: boolean;
    border?: boolean;
    rounded?: boolean;
    paddingX2?: boolean;
    backgroundColor?: string;
    borderColorHover?: string;
    textWhite?: boolean;
    uppercase?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}