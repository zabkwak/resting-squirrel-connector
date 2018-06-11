import 'babel-polyfill';

import Api from './api';

/**
 * @typedef ModuleConfig
 * @property {string} url The URL of the Resting Squirrel API.
 * @property {string} dataKey Key which contains data informations in the response. Default: 'data'.
 * @property {string} errorKey Key which contains error informations in the response. Default: 'error'.
 * @property {boolean} meta If true meta data are returned in the response. Default: true.
 */

/**
 * 
 * @param {ModuleConfig} config 
 */
const fn = (config = {}) => {

    const { url, dataKey, errorKey, meta } = config;

    const createApi = (version = null) => new Api(url, version, dataKey, errorKey, meta);

    const M = createApi();

    /**
     * 
     * @param {number} version Version of the API endpoint.
     */
    M.v = version => createApi(version);

    return M;
};

export default fn;
