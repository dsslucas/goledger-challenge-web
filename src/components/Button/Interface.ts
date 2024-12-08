import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonInterface {
    children: React.ReactNode;
    type: 'button' | 'submit' | 'reset'; 
    flex?: boolean;
    flexColumn?: boolean;
    justifyCenter?: boolean;
    itemsCenter?: boolean;
    widthFull?: boolean;
    active?: boolean;
    rowKey?: string | number;
    width25Percent?: boolean;
    border?: boolean;
    rounded?: boolean;
    roundedB?: boolean;
    roundedBNoneTablet?: boolean;
    roundedBrTablet?: boolean;
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