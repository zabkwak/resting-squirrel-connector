declare interface Options {
	url: string;
	dataKey?: string;
	errorKey?: string;
	meta?: boolean;
	apiKey?: string;
	keepAlive?: string;
}

declare class BaseResponse {
	statusCode: number;
	meta: { [key: string]: any };
	data: { [key: string]: any };
}

export class ErrorResponse extends BaseResponse {
	message: string;
	code: string;
}

export class DataResponse extends BaseResponse {
	isEmpty(): boolean;
}

declare type Data<T = {}> = DataResponse & T;

declare type Error<T = {}> = ErrorResponse & T;

declare type Callback<T = {}, U = {}> = (err?: Error<U>, data?: Data<T>, meta?: { [key: string]: any }) => void;

declare class Api {

	put<T = {}, U = {}>(endpoint: string, cb: Callback<T, U>): void;
	put<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
	put<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

	put<T = {}>(endpoint: string): Promise<Data<T>>;
	put<T = {}>(endpoint: string, params: { [key: string]: any }): Promise<Data<T>>;
	put<T = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<Data<T>>;


	get<T = {}, U = {}>(endpoint: string, cb: Callback<T, U>): void;
	get<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
	get<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

	get<T = {}>(endpoint: string): Promise<Data<T>>;
	get<T = {}>(endpoint: string, params: { [key: string]: any }): Promise<Data<T>>;
	get<T = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<Data<T>>;


	post<T = {}, U = {}>(endpoint: string, cb: Callback<T, U>): void;
	post<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
	post<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

	post<T = {}>(endpoint: string): Promise<Data<T>>;
	post<T = {}>(endpoint: string, params: { [key: string]: any }): Promise<Data<T>>;
	post<T = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<Data<T>>;


	delete<T = {}, U = {}>(endpoint: string, cb: Callback<T, U>): void;
	delete<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
	delete<T = {}, U = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

	delete<T = {}>(endpoint: string): Promise<Data<T>>;
	delete<T = {}>(endpoint: string, params: { [key: string]: any }): Promise<Data<T>>;
	delete<T = {}>(endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<Data<T>>;


	request<T = {}, U = {}>(method: string, endpoint: string, cb: Callback<T, U>): void;
	request<T = {}, U = {}>(method: string, endpoint: string, params: { [key: string]: any }, cb: Callback<T, U>): void;
	request<T = {}, U = {}>(method: string, endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }, cb: Callback<T, U>): void;

	request<T = {}>(method: string, endpoint: string): Promise<Data<T>>;
	request<T = {}>(method: string, endpoint: string, params: { [key: string]: any }): Promise<Data<T>>;
	request<T = {}>(method: string, endpoint: string, params: { [key: string]: any }, headers: { [key: string]: any }): Promise<Data<T>>;

}

export class ApiWrapper extends Api {
	v(version: number): Api;
	ping<T = {}, U = {}>(cb: Callback<T, U>): void;
}

declare function M(options: Options): ApiWrapper;

declare namespace M {
	export var cacheTTL: number;
	export let concurrency: number;
}
export default M;
