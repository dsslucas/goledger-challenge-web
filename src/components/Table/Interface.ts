export interface TableInterface {
    children: React.ReactNode;

    textCenter?: boolean;
    widthFull?: boolean;
}

export interface TableHeaderInterface {
    children: React.ReactNode;

    top0?: boolean;
    sticky?: boolean;
    backgroundGray?: boolean;
    textWhite?: boolean;
}

export interface TableThInterface {
    children: React.ReactNode;
}

export interface TableBodyInterface {
    children: React.ReactNode;
}

export interface TableTrInterface {
    children: React.ReactNode;

    rowKey?: string | number;
    backgroundStripedGray?: boolean;
}

export interface TableTdInterface {
    children: React.ReactNode;
}
