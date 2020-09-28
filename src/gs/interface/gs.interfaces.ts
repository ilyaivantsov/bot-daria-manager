export interface IClient {
    login: string;
    password: string;
    importance: number;
    status: string;
    members: number;
    afterDate: number;
    beforeDate: number;
}

export interface IDataSheet {
    title: string;
    headerRow: Array<string>;
    data: Array<any>;
}