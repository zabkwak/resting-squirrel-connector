import request from 'request';

/**
 * @typedef ErrorResponse
 * @property {string} message
 * @property {string} code
 */

/** @typedef {Object.<string, any>} DataResponse */

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

    /**
     * 
     * @param {string} url 
     * @param {?number} version 
     * @param {string} dataKey 
     * @param {string} errorKey 
     * @param {boolean} meta 
     */
    constructor(url, version = null, dataKey = 'data', errorKey = 'error', meta = true) {
        this._url = url;
        this._version = version;
        this._dataKey = dataKey;
        this._errorKey = errorKey;
        this._meta = meta;
        if (!this._url) {
            throw new Error('No url specified.');
        }
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    get(endpoint, params, headers, cb) {
        this.request('get', endpoint, params, headers, cb);
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    post(endpoint, params, headers, cb) {
        this.request('post', endpoint, params, headers, cb);
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    put(endpoint, params, headers, cb) {
        this.request('put', endpoint, params, headers, cb);
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    delete(endpoint, params, headers, cb) {
        this.request('delete', endpoint, params, headers, cb);
    }

    /**
     * 
     * @param {string} method
     * @param {string} endpoint 
     * @param {Object.<string, any>|Callback} params 
     * @param {Object.<string, string>|Callback} headers 
     * @param {Callback} cb 
     */
    request(method, endpoint, params, headers, cb) {
        if (typeof params === 'function') {
            cb = params;
            params = {};
            headers = {};
        }
        if (typeof headers === 'function') {
            cb = headers;
            headers = {};
        }
        if (typeof cb !== 'function') {
            cb = () => { };
        }
        if (endpoint.indexOf('/') !== 0) {
            endpoint = `/${endpoint}`;
        }
        const url = `${this._url}${this._version !== null ? `/${this._version}` : ''}${endpoint}`;
        const paramsKey = method === 'get' ? 'qs' : 'body';
        let qs;
        if (paramsKey === 'qs') {
            params.nometa = this._meta ? undefined : '';
        } else {
            qs = { nometa: this._meta ? undefined : '' };
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
                cb(err);
                return;
            }
            // TODO deprecation info
            if (body[this._errorKey]) {
                cb(body[this._errorKey], null, body._meta);
                return;
            }
            if (body[this._dataKey]) {
                cb(null, body[this._dataKey], body._meta);
                return;
            }
        });
    }
}
