import { DataResponse, ErrorResponse } from './response';
import Request from './request';
import Builder from './builder';

/** @typedef {Object.<string, any>} MetaData */

/** 
 * @typedef {function(ErrorResponse, DataResponse, MetaData):void} Callback 
 */

/**
 * Base class for api calls.
 */
export default class Api {

	get Builder() {
		return new Builder(this);
	}

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
	/** @type {boolean} */
	_keepAlive = false;
	/** @type {boolean} */
	_logWarning = true;

    /**
     * 
     * @param {string} url The URL of the Resting Squirrel API.
     * @param {?number} version The version of the API endpoint. Default: null.
     * @param {string} dataKey Key which contains data informations in the response. Default: 'data'.
     * @param {string} errorKey Key which contains error informations in the response. Default: 'error'.
     * @param {boolean} meta If true meta data are returned in the response. Default: true.
     * @param {?string} apiKey The api key to validates calls on the API. Default: null.
 	 * @param {?boolean} keepAlive Indicates if the connection should be kept alive. Default: false.
 	 * @param {?boolean} logWarning Indicates if the warnings should be printed to stdout. Default: false.
     */
    constructor(url, version = null, dataKey = 'data', errorKey = 'error', meta = true, apiKey = null, keepAlive = false, logWarning = false) {
        this._url = url;
        this._version = version;
        this._dataKey = dataKey;
        this._errorKey = errorKey;
        this._meta = meta;
		this._apiKey = apiKey;
		this._keepAlive = keepAlive;
		this._logWarning = logWarning
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
            let response;
            try {
                response = await this.request(method, endpoint, params, headers);
            } catch (e) {
                process.nextTick(() => cb(e, null, e.meta));
                return;
            }
            process.nextTick(() => cb(null, response, response.meta));
            return;
        }
        const url = `${this._url}${this._version !== null ? `/${this._version}` : ''}${endpoint}`;
        let qs = {
            nometa: this._meta ? void 0 : '',
            api_key: this._apiKey || void 0,
        };
        let body;
        if (method === 'get') {
            qs = { ...qs, ...params };
        } else {
            body = { ...params };
        }
        const r = new Request(url, method, qs, body, headers, this._dataKey, this._errorKey, this._keepAlive, this._logWarning);
        return r.execute();
    }
}
