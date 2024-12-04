export interface ButtonInterface {
    children: React.ReactNode;
    flex?: boolean;
    flexColumn?: boolean;
    justifyCenter?: boolean;
    itemsCenter?: boolean;
    widthFull?: boolean;
    active?: boolean;
    key?: number;
    width25Percent?: boolean;
    border?: boolean;
    rounded?: boolean;
    roundedB?: boolean;
    padding2?: boolean;
    paddingX2?: boolean;
    backgroundColor?: string;
    gapX2?: boolean;

    successBackgroundColor?: boolean;
    editBackgroundColor?: boolean;
    infoBackgroundColor?: boolean;    
    deleteBackgroundColor?: boolean;

    borderColorHover?: string;
    textWhite?: boolean;
    uppercase?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: boolean;
}