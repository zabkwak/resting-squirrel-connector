export default class Response {

    get statusCode() {
        return this._code;
    }

    get meta() {
        return this._meta;
    }

    get data() {
        return { ...this._data };
    }

    constructor(statusCode, data = null, meta = undefined) {
        Object.defineProperties(this, {
            _code: {
                value: statusCode,
                enumerable: false,
            },
            _data: {
                value: data,
                enumerable: false,
            },
            _meta: {
                value: meta,
                enumerable: false,
            },
        });
    }
}