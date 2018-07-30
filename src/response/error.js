import SmartError from 'smart-error';
import Base from './base';

export default class ErrorResponse extends Base {

    message = null;
    code = null;

    constructor(statusCode, error, meta) {
        super(statusCode, error, meta);
        this.message = this._data.message;
        this.code = this._data.code;

        const err = new SmartError(error);
        const payload = err._parsePayload(err);
        Object.keys(payload).forEach(key => this[key] = payload[key]);
    }
}