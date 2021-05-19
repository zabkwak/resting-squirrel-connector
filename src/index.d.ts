declare interface Options {
	url: string;
	dataKey?: string;
	errorKey?: string;
	meta?: boolean;
	apiKey?: string;
	keepAlive?: boolean;
	logWarning?: boolean;
}

declare class BaseResponse {
	statusCode: number;
	meta: { [key: string]: any };
	data: { [key: string]: any };
}

export class ErrorResponse extends BaseResponse {
	message: string;
	code: string;
	stacktrace: string[];
	stack: string;
}

export class DataResponse extends BaseResponse {
	isEmpty(): boolean;
}

declare type Data<T = {}> = DataResponse & T;

declare type Error<T = {}> = ErrorResponse & T;

declare type Callback<T = {}, U = {}> = (err?: Error<U>, data?: Data<T>, meta?: { [key: string]: any }) => void;

export class Builder<A = { [key: string]: any }, P = { [key: string]: any }, H = { [key: string]: any }, R = {}> {

	constructor(api: Api);
	constructor(api: Api, authHeader: string);

	public execute<T extends R>(): Promise<Data<T>>;

	public v(version: number): this;

	public get(endpoint: string): this;

	public put(endpoint: string): this;

	public post(endpoint: string): this;

	public delete(endpoint: string): this;

	public sign(authorization: string): this;
	public sign(key: string, value: any): this;

	public addHeader<K extends keyof H>(key: K, value: H[K]): this;

	public addParam<K extends keyof P>(key: K, value: P[K]): this;

	public addArgument<K extends keyof A>(key: K, value: A[K]): this;

	/** @deprecated */
	public setHeaders(headers: H): this;

	/** @deprecated */
	public setParams(params: P): this;

	/** @deprecated */
	public setArguments(arguments: A): this;

	public headers(headers: H): this;
	
	public params(params: P): this;
	
	public args(arguments: A): this;
}

declare class RequestBuilder<A = { [key: string]: any }, P = { [key: string]: any }, H = { [key: string]: any }, R = {}> extends Builder<A, P, H, R> {

	constructor();
	constructor(authHeader: string);
}

declare class Api {

	/** @deprecated */
	public Builder: Builder;

	public Request: typeof RequestBuilder;

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
