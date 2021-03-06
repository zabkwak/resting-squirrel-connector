import '@babel/polyfill';

import Api from './api';
import Request from './request';
import { DataResponse, ErrorResponse } from './response';

/**
 * @typedef ModuleConfig
 * @property {string} url The URL of the Resting Squirrel API.
 * @property {?string} dataKey Key which contains data informations in the response. Default: 'data'.
 * @property {?string} errorKey Key which contains error informations in the response. Default: 'error'.
 * @property {?boolean} meta If true meta data are returned in the response. Default: true.
 * @property {?string} apiKey The api key to validates calls on the API. Default: null.
 * @property {?boolean} keepAlive Indicates if the connection should be kept alive. Default: false.
 * @property {?boolean} logWarning Indicates if the warnings should be printed to stdout. Default: false.
 */

/**
 * 
 * @param {ModuleConfig} config 
 */
const fn = (config = {}) => {

    const { url, dataKey, errorKey, meta, apiKey, keepAlive, logWarning } = config;

    const createApi = (version = null) => new Api(url, version, dataKey, errorKey, meta, apiKey, keepAlive, logWarning);

    const M = createApi();

    /**
     * 
     * @param {number} version Version of the API endpoint.
     */
    M.v = version => createApi(version);

    M.ping = (cb) => createApi().get('/ping', cb);

    return M;
};

Object.defineProperties(fn, {
    concurrency: {
        set: value => Request.concurrency = value,
        get: () => Request.concurrency,
    },
    cacheTTL: {
        set: value => Request.cacheTTL = value,
        get: () => Request.cacheTTL,
    },
});

export {
    fn as default,
    DataResponse,
    ErrorResponse,
};
