import Base from './base';

export default class ErrorResponse extends Base {

    message = null;
    code = null;

    constructor(statusCode, error, meta) {
        super(statusCode, error, meta);
        this.message = this._data.message;
        this.code = this._data.code;
    }
}