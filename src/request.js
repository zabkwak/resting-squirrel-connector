import request from 'request';
import md5 from 'md5';
import { EventEmitter } from 'events';

import { DataResponse, ErrorResponse } from './response';

const TIMEOUT = 100;

class E extends EventEmitter { }

const e = new E();

export default class Request {

    static concurrency = 200;
    static cacheTTL = 1000;

    static _count = 0;
    static _cache = {};

    _url = null;
    _method = null;
    _qs = {};
    _body = {};
    _headers = {};
    _dataKey = null;
    _errorKey = null;

    _locked = false;

    constructor(url, method, qs, body, headers, dataKey = 'data', errorKey = 'error') {
        this.key = md5(`${method}${url}${JSON.stringify(qs)}${JSON.stringify(body)}${JSON.stringify(headers)}`);
        this._url = url;
        this._method = method;
        this._qs = qs;
        this._body = body;
        this._headers = headers;
        this._dataKey = dataKey;
        this._errorKey = errorKey;
    }

    async execute() {
        if (Request._count < Request.concurrency) {
            Request._count++;
            this._locked = false;
        } else {
            this._locked = true;
        }
        if (!this._locked) {
            return this._execute();
        }
        await this._wait();
        return this.execute();
    }

    async _execute() {
        if (Request.cacheTTL > 0) {
            if (Request._cache[this.key] === undefined) {
                Request._cache[this.key] = null;
            } else {
                if (Request._cache[this.key] === null) {
                    await this._wait();
                    return this._execute();
                } else {
                    return new Promise((resolve, reject) => {
                        const response = Request._cache[this.key];
                        Request._count--;
                        if (response instanceof ErrorResponse) {
                            reject(response);
                            return;
                        }
                        resolve(response);
                    });
                }
            }
        }
        return new Promise(async (resolve, reject) => {
            let response;
            try {
                response = await this._request();
            } catch (e) {
                response = e;
            }
            Request._cache[this.key] = response;
            Request._count--;
            if (response instanceof ErrorResponse) {
                reject(response);
            } else {
                resolve(response);
            }
            setTimeout(() => {
                delete Request._cache[this.key];
            }, Request.cacheTTL);
        });
    }

    _request() {
        return new Promise((resolve, reject) => {
            request[this._method]({
                url: this._url,
                gzip: true,
                json: true,
                qs: this._qs,
                body: this._body,
                headers: this._headers,
            }, (err, res, body) => {
                if (err) {
                    reject(new ErrorResponse(500, err));
                    return;
                }
                if (!res) {
                    reject(new ErrorResponse(500, new Error('Unknown error')));
                    return;
                }
                const { statusCode } = res;
                if (!body) {
                    if (statusCode === 204) {
                        resolve(new DataResponse(statusCode));
                    } else {
                        reject(new ErrorResponse(statusCode, err));
                    }
                    return;
                }
                const data = body[this._dataKey];
                const error = body[this._errorKey];
                const meta = body._meta;
                // TODO deprecation info
                if (error) {
                    reject(new ErrorResponse(statusCode, error, meta));
                    return;
                }
                resolve(new DataResponse(statusCode, data, meta));
            });
        });
    }

    _wait(timeout = TIMEOUT) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
}
