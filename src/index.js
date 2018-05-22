import Api from './api';

/**
 * @typedef ModuleConfig
 * @property {string} url
 * @property {string} dataKey
 * @property {string} errorKey
 * @property {boolean} meta 
 */

/**
 * 
 * @param {ModuleConfig} config 
 */
const fn = (config = {}) => {

    const { url, dataKey, errorKey, meta } = config;

    const createApi = (version = null) => new Api(url, version, dataKey, errorKey, meta);

    const M = createApi();

    M.v = version => createApi(version);

    return M;
};

export default fn;
