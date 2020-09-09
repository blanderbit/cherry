export interface IErrorResponse {
    error: IErrorReponseData;
}

export interface IErrorReponseData {
    code: number;
    message: string;
}
