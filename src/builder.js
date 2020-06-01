import Error from 'smart-error';
import RouteParser from 'route-parser';

export default class Builder {

	/** @type {import('./api').default} */
	_api = null;

	/** @type {string} */
	_method = null;

	/** @type {string} */
	_endpoint = null;

	_headers = null;

	_params = null;

	_args = null;

	constructor(api) {
		this._api = api;
	}

	execute() {
		if (!this._method) {
			throw new Error('Method is not defined', 'no_method_defined');
		}
		if (!this._endpoint) {
			throw new Error('Endpoint is not defined', 'no_endpoint_defined');
		}
		// TODO route-parser
		return this._api[this._method](
			this._getEndpoint(),
			this._params,
			this._headers,
		);
	}

	get(endpoint) {
		this._setEndpoint(endpoint, 'get');
		return this;
	}

	put(endpoint) {
		this._setEndpoint(endpoint, 'put');
		return this;
	}

	post(endpoint) {
		this._setEndpoint(endpoint, 'post');
		return this;
	}

	delete(endpoint) {
		this._setEndpoint(endpoint, 'delete');
		return this;
	}

	addParam(key, value) {
		if (!this._params) {
			this._params = {};
		}
		this._params[key] = value;
		return this;
	}

	sign(key, token) {
		this.addHeader(key, token);
		return this;
	}

	addHeader(key, value) {
		if (!this._headers) {
			this._headers = {};
		}
		this._headers[key] = value;
		return this;
	}

	addArgument(key, value) {
		if (!this._args) {
			this._args = {};
		}
		this._args[key] = value;
		return this;
	}

	setParams(params) {
		this._params = params;
		return this;
	}

	setHeaders(headers) {
		this._headers = headers;
		return this;
	}

	setArguments(args) {
		this._args = args;
		return this;
	}

	_setEndpoint(endpoint, method) {
		this._method = method;
		this._endpoint = endpoint;
	}

	_getEndpoint() {
		return this._args ? new RouteParser(this._endpoint).reverse(this._args) : this._endpoint;
	}
}