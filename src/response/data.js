import Base from './base';

export default class DataResponse extends Base {

    constructor(statusCode, data, meta) {
        super(statusCode, data, meta);
        if (this._data) {
            Object.keys(this._data).forEach(key => Object.defineProperty(this, key, { value: this._data[key], enumerable: true }));
        }
    }

    isEmpty() {
        return this._data === null;
    }
}