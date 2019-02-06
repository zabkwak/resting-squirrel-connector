declare module 'resting-squirrel-connector' {

    interface Options {
        url: string;
        dataKey?: string;
        errorKey?: string;
        meta?: boolean;
        apiKey?: string;
    }

    class Response {

        statusCode: number;
        meta: { [key: string]: any };
        data: { [key: string]: any };
    }

    export class ErrorResponse extends Response {
        message: string;
        code: string;
    }

    export class DataResponse extends Response {

        isEmpty(): boolean;
    }

    type Callback<T extends DataResponse, U extends ErrorResponse> = (err?: U, data?: T, meta?: { [key: string]: any }) => void;

    class Api {

        put<T extends DataResponse, U extends ErrorResponse>(endpoint: string, cb: Callback<T, U>): void;
        put<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
        put<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

        put<T extends DataResponse>(endpoint: string): Promise<T>;
        put<T extends DataResponse>(endpoint: string, params: { [key: string]: any }): Promise<T>;
        put<T extends DataResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<T>;


        get<T extends DataResponse, U extends ErrorResponse>(endpoint: string, cb: Callback<T, U>): void;
        get<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
        get<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

        get<T extends DataResponse>(endpoint: string): Promise<T>;
        get<T extends DataResponse>(endpoint: string, params: { [key: string]: any }): Promise<T>;
        get<T extends DataResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<T>;


        post<T extends DataResponse, U extends ErrorResponse>(endpoint: string, cb: Callback<T, U>): void;
        post<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
        post<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

        post<T extends DataResponse>(endpoint: string): Promise<T>;
        post<T extends DataResponse>(endpoint: string, params: { [key: string]: any }): Promise<T>;
        post<T extends DataResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<T>;


        delete<T extends DataResponse, U extends ErrorResponse>(endpoint: string, cb: Callback<T, U>): void;
        delete<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
        delete<T extends DataResponse, U extends ErrorResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

        delete<T extends DataResponse>(endpoint: string): Promise<T>;
        delete<T extends DataResponse>(endpoint: string, params: { [key: string]: any }): Promise<T>;
        delete<T extends DataResponse>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<T>;


        request<T extends DataResponse, U extends ErrorResponse>(method: string, endpoint: string, cb: Callback<T, U>): void;
        request<T extends DataResponse, U extends ErrorResponse>(method: string, endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
        request<T extends DataResponse, U extends ErrorResponse>(method: string, endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

        request<T extends DataResponse>(method: string, endpoint: string): Promise<T>;
        request<T extends DataResponse>(method: string, endpoint: string, params: { [key: string]: any }): Promise<T>;
        request<T extends DataResponse>(method: string, endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<T>;

    }

    export class _Api extends Api {

        v(version: number): Api;
        ping<T extends DataResponse, U extends ErrorResponse>(cb: Callback<T, U>): void;
    }

    function M(options: Options): _Api;

    namespace M {
        export var cacheTTL: number;
        export let concurrency: number;
    }
    export default M;
}