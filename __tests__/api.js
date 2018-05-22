import { expect } from 'chai';
import rs, { Param, Type } from 'resting-squirrel';

import Connector from '../src';
import Api from '../src/api';

const URL = 'http://localhost:8080';

const app = rs({
    log: false,
    logStack: false,
    auth: (req, res, next) => {
        if (!req.headers['x-token']) {
            res.send401();
            return;
        }
        if (req.headers['x-token'] !== 'TOKEN') {
            res.send401();
            return;
        }
        next();
    }
});

['get', 'post', 'put', 'delete'].forEach((method) => {
    app[method]('/test', false, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
    app[method]('/test/auth', true, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
    app[method](0, '/test', false, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
    app[method](0, '/test/auth', true, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
});

const calls = (method, api = new Api(URL, 0)) => {

    it(`calls the ${method} endpoint without params`, (done) => {
        api[method]('/test', (err, data, meta) => {
            expect(err).to.be.an('object');
            expect(err).to.have.all.keys(['message', 'code']);
            expect(err.message).to.be.equal('Parameter \'int\' is missing.');
            expect(err.code).to.be.equal('ERR_MISSING_PARAMETER');
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter of wrong type`, (done) => {
        api[method]('/test', { int: 'test' }, (err, data, meta) => {
            expect(err).to.be.an('object');
            expect(err).to.have.all.keys(['message', 'code']);
            expect(err.message).to.be.equal('Parameter \'int\' has invalid type. It should be \'integer\'.');
            expect(err.code).to.be.equal('ERR_INVALID_TYPE');
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter`, (done) => {
        api[method]('/test', { int: 1 }, (err, data, meta) => {
            expect(err).to.be.null;
            expect(data).to.have.all.keys(['success']);
            expect(data.success).to.be.true;
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter without meta data`, (done) => {
        api._meta = false;
        api[method]('/test', { int: 1 }, (err, data, meta) => {
            expect(err).to.be.null;
            expect(data).to.have.all.keys(['success']);
            expect(data.success).to.be.true;
            expect(meta).to.be.undefined;
            api._meta = true;
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter without the slash in the endpoint`, (done) => {
        api._meta = true;
        api[method]('test', { int: 1 }, (err, data, meta) => {
            expect(err).to.be.null;
            expect(data).to.have.all.keys(['success']);
            expect(data.success).to.be.true;
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter without token`, (done) => {
        api._meta = true;
        api[method]('/test/auth', { int: 1 }, (err, data, meta) => {
            expect(err).to.be.an('object');
            expect(err).to.have.all.keys(['message', 'code']);
            expect(err.message).to.be.equal('Unauthorized');
            expect(err.code).to.be.equal('ERR_UNAUTHORIZED');
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter with invalid token`, (done) => {
        api._meta = true;
        api[method]('/test/auth', { int: 1 }, { 'x-token': 'INVALID_TOKEN' }, (err, data, meta) => {
            expect(err).to.be.an('object');
            expect(err).to.have.all.keys(['message', 'code']);
            expect(err.message).to.be.equal('Unauthorized');
            expect(err.code).to.be.equal('ERR_UNAUTHORIZED');
            expect(meta).to.be.an('object');
            done();
        });
    });

    it(`calls the ${method} endpoint with parameter with token`, (done) => {
        api._meta = true;
        api[method]('/test/auth', { int: 1 }, { 'x-token': 'TOKEN' }, (err, data, meta) => {
            expect(err).to.be.null;
            expect(data).to.have.all.keys(['success']);
            expect(data.success).to.be.true;
            expect(meta).to.be.an('object');
            done();
        });
    });
};

describe('Module checking', () => {

    it('creates the default api instance', () => {

        const api = Connector({ url: URL });
        expect(api).to.be.an.instanceOf(Api);
        expect(api).to.have.all.keys(['_url', '_version', '_meta', '_dataKey', '_errorKey', 'v']);
        expect(api._url).to.be.equal(URL);
        expect(api._version).to.be.null;
        expect(api._meta).to.be.true;
        expect(api._dataKey).to.be.equal('data');
        expect(api._errorKey).to.be.equal('error');
        expect(api.v).to.be.a('function');
    });

    it('tries to create api instance without the url', () => {
        expect(Connector).to.throw(Error).that.has.property('message', 'No url specified.');
    });

    it('creates the api instance with version', () => {
        const api = Connector({ url: URL }).v(0);
        expect(api).to.be.an.instanceOf(Api);
        expect(api).to.have.all.keys(['_url', '_version', '_meta', '_dataKey', '_errorKey']);
        expect(api._url).to.be.equal(URL);
        expect(api._version).to.be.equal(0);
        expect(api._meta).to.be.true;
        expect(api._dataKey).to.be.equal('data');
        expect(api._errorKey).to.be.equal('error');
    });
});

describe('Start of the server', () => {

    it('starts the server', (done) => {
        app.start(done);
    });
});

describe('Api calls', () => {

    describe('GET', () => {

        calls('get');
    });

    describe('POST', () => {

        calls('post');
    });

    describe('PUT', () => {

        calls('put');
    });

    describe('DELETE', () => {

        calls('delete');
    });
});

describe('Module calls', () => {

    const connector = Connector({ url: URL });

    describe('GET without version', () => {

        calls('get', connector);
    });

    describe('GET with version', () => {

        calls('get', connector.v(0));
    });

    describe('POST without version', () => {

        calls('post', connector);
    });

    describe('POST with version', () => {

        calls('post', connector.v(0));
    });

    describe('GET without version', () => {

        calls('get', connector);
    });

    describe('PUT with version', () => {

        calls('put', connector.v(0));
    });

    describe('PUT without version', () => {

        calls('put', connector);
    });

    describe('DELETE with version', () => {

        calls('delete', connector.v(0));
    });
});