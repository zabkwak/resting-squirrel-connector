import SmartError from 'smart-error';
import Base from './base';

export default class ErrorResponse extends Base {

    message = null;
    code = null;
	stacktrace = null;

    constructor(statusCode, error, meta) {
        super(statusCode, error, meta);
        this.message = this._data.message;
        this.code = this._data.code;
		this.stacktrace = this._data.stack;

        const payload = this._parsePayload(error);
        Object.keys(payload).forEach(key => this[key] = payload[key]);
    }

    _parsePayload(err) {
        const o = {};
        for (let k in err) {
            if (['message', 'code', 'stack'].indexOf(k) >= 0) {
                continue;
            }
            o[k] = err[k];
        }
        return o;
    }
}