import request from 'request';

import { DataResponse, ErrorResponse } from './response';

/** @typedef {Object.<string, any>} MetaData */

/** 
 * @typedef {function(ErrorResponse, DataResponse, MetaData):void} Callback 
 */

/**
 * Base class for api calls.
 */
export default class Api {

    /** @type {string} */
    _url = null;
    /** @type {?number} */
    _version = null;
    /** @type {string} */
    _dataKey = 'data';
    /** @type {string} */
    _errorKey = 'error';
    /** @type {boolean} */
    _meta = true;
    /** @type {?string} */
    _apiKey = null;

    /**
     * 
     * @param {string} url The URL of the Resting Squirrel API.
     * @param {?number} version The version of the API endpoint. Default: null.
     * @param {string} dataKey Key which contains data informations in the response. Default: 'data'.
     * @param {string} errorKey Key which contains error informations in the response. Default: 'error'.
     * @param {boolean} meta If true meta data are returned in the response. Default: true.
     * @param {?string} apiKey The api key to validates calls on the API. Default: null.
     */
    constructor(url, version = null, dataKey = 'data', errorKey = 'error', meta = true, apiKey = null) {
        this._url = url;
        this._version = version;
        this._dataKey = dataKey;
        this._errorKey = errorKey;
        this._meta = meta;
        this._apiKey = apiKey;
        if (!this._url) {
            throw new Error('No url specified.');
        }
    }

    /**
     * Calls the API endpoint with http GET method. 
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    get(endpoint, params, headers, cb) {
        return this.request('get', endpoint, params, headers, cb);
    }

    /**
     * Calls the API endpoint with http POST method. 
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    post(endpoint, params, headers, cb) {
        return this.request('post', endpoint, params, headers, cb);
    }

    /**
     * Calls the API endpoint with http PUT method. 
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    put(endpoint, params, headers, cb) {
        return this.request('put', endpoint, params, headers, cb);
    }

    /**
     * Calls the API endpoint with http DELETE method. 
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    delete(endpoint, params, headers, cb) {
        return this.request('delete', endpoint, params, headers, cb);
    }

    /**
     * Calls the API endpoint with specified http method. 
     * 
     * @param {string} method
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     * 
     * @returns {?Promise<DataResponse>}
     */
    async request(method, endpoint, params = {}, headers = {}, cb = null) {
        if (typeof params === 'function') {
            cb = params;
            params = {};
            headers = {};
        }
        if (typeof headers === 'function') {
            cb = headers;
            headers = {};
        }
        if (endpoint.indexOf('/') !== 0) {
            endpoint = `/${endpoint}`;
        }
        if (typeof cb === 'function') {
            this._request(method, endpoint, params, headers, (err, { statusCode }, data, meta) => {
                if (err) {
                    cb(new ErrorResponse(statusCode, err, meta), null, meta);
                    return;
                }
                cb(null, new DataResponse(statusCode, data, meta), meta);
            });
            return null;
        }
        return new Promise((resolve, reject) => {
            this._request(method, endpoint, params, headers, (err, { statusCode }, data, meta) => {
                if (err) {
                    reject(new ErrorResponse(statusCode, err, meta));
                    return;
                }
                resolve(new DataResponse(statusCode, data, meta));
            });
        });
    }

    _request(method, endpoint, params, headers, cb) {
        const url = `${this._url}${this._version !== null ? `/${this._version}` : ''}${endpoint}`;
        const paramsKey = method === 'get' ? 'qs' : 'body';
        let qs;
        if (paramsKey === 'qs') {
            params.nometa = this._meta ? void 0 : '';
            params.api_key = this._apiKey || void 0;
        } else {
            qs = {
                nometa: this._meta ? void 0 : '',
                api_key: this._apiKey || void 0,
            };
        }
        request[method]({
            url,
            gzip: true,
            json: true,
            qs: qs || undefined,
            [paramsKey]: params,
            headers,
        }, (err, res, body) => {
            if (err) {
                cb(err, res);
                return;
            }
            if (!body) {
                if (res.statusCode === 204) {
                    cb(null, res);
                } else {
                    cb(new Error('Unknown error'), res);
                }
                return;
            }
            // TODO deprecation info
            if (body[this._errorKey]) {
                cb(body[this._errorKey], res, null, body._meta);
                return;
            }
            if (!res) {
                cb(new Error('Unknown error'), { statusCode: 500 });
                return;
            }
            cb(null, res || { statusCode: 500 }, body[this._dataKey], body._meta);
        });
    }
}
