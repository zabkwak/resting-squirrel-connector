import request from 'request';

import { DataResponse, ErrorResponse } from './response';

const TIMEOUT = 100;

export default class Request {

    static concurrency = 200;

    static _count = 0;

    _url = null;
    _method = null;
    _qs = {};
    _body = {};
    _headers = {};
    _dataKey = null;
    _errorKey = null;

    _locked = false;

    constructor(url, method, qs, body, headers, dataKey = 'data', errorKey = 'error') {
        this._url = url;
        this._method = method;
        this._qs = qs;
        this._body = body;
        this._headers = headers;
        this._dataKey = dataKey;
        this._errorKey = errorKey;
    }

    async execute() {
        if (Request._count < 50) {
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

    _execute() {
        return new Promise((resolve, reject) => {
            request[this._method]({
                url: this._url,
                gzip: true,
                json: true,
                qs: this._qs,
                body: this._body,
                headers: this._headers,
            }, (err, res, body) => {
                Request._count--;
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

    _wait() {
        return new Promise(resolve => setTimeout(resolve, TIMEOUT));
    }
}
