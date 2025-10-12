export interface CustomError<T> {
    code: string;
    message: string;
    data?: T;
}
