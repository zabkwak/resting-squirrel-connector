import { expect } from 'chai';
import rs, { Param, Type } from 'resting-squirrel';
import Error from 'smart-error';

import Connector from '../src';
import Api from '../src/api';
import { DataResponse, ErrorResponse } from '../src/response';

const URL = 'http://localhost:8081';

const app = rs({
    port: 8081,
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
    app[method]('/test/204', (req, res, next) => next());
    app[method](0, '/test', false, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
    app[method](0, '/test/auth', true, [new Param('int', true, Type.integer)], (req, res, next) => next(null, { success: true }));
    app[method](0, '/test/204', (req, res, next) => next());
});

const calls = (method, api = new Api(URL, 0)) => {

    it(`calls the ${method} endpoint without params`, async () => {
        try {
            await api[method]('/test');
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code', 'stack']);
            expect(error.message).to.be.equal('Parameter \'int\' is missing.');
            expect(error.code).to.be.equal('ERR_MISSING_PARAMETER');
            expect(error.statusCode).to.be.equal(400);
            expect(error.meta).to.be.an('object');
        }
    });

    it(`calls the ${method} endpoint with parameter of wrong type`, async () => {
        try {
            await api[method]('/test', { int: 'test' });
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code', 'stack', 'type_error']);
            expect(error.message).to.be.equal('Parameter \'int\' has invalid type. It should be \'integer\'.');
            expect(error.code).to.be.equal('ERR_INVALID_TYPE');
            expect(error.statusCode).to.be.equal(400);
            expect(error.meta).to.be.an('object');
        }
    });

    it(`calls the ${method} endpoint with parameter`, async () => {
        const data = await api[method]('/test', { int: 1 });
        expect(data).to.be.an('object');
        expect(data).to.be.an.instanceOf(DataResponse);
        expect(data).to.have.all.keys(['success']);
        expect(data.success).to.be.true;
        expect(data.statusCode).to.be.equal(200);
        expect(data.meta).to.be.an('object');
        expect(data.data).to.be.an('object');
    });

    it(`calls the ${method} endpoint with parameter without meta data`, async () => {
        api._meta = false;
        const data = await api[method]('/test', { int: 1 });
        expect(data).to.be.an('object');
        expect(data).to.be.an.instanceOf(DataResponse);
        expect(data).to.have.all.keys(['success']);
        expect(data.success).to.be.true;
        expect(data.statusCode).to.be.equal(200);
        expect(data.meta).to.be.undefined;
        expect(data.data).to.be.an('object');
        api._meta = true;
    });

    it(`calls the ${method} endpoint with parameter without the slash in the endpoint`, async () => {
        const data = await api[method]('test', { int: 1 });
        expect(data).to.be.an('object');
        expect(data).to.be.an.instanceOf(DataResponse);
        expect(data).to.have.all.keys(['success']);
        expect(data.success).to.be.true;
        expect(data.statusCode).to.be.equal(200);
        expect(data.meta).to.be.an('object');
        expect(data.data).to.be.an('object');
    });

    it(`calls the ${method} endpoint with parameter without token`, async () => {
        try {
            await api[method]('/test/auth', { int: 1 });
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code', 'stack']);
            expect(error.message).to.be.equal('The access token is missing.');
            expect(error.code).to.be.equal('ERR_MISSING_ACCESS_TOKEN');
            expect(error.statusCode).to.be.equal(401);
            expect(error.meta).to.be.an('object');
        }
    });

    it(`calls the ${method} endpoint with parameter with invalid token`, async () => {
        try {
            await api[method]('/test/auth', { int: 1 }, { 'x-token': 'INVALID_TOKEN' });
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code', 'stack']);
            expect(error.message).to.be.equal('Unauthorized');
            expect(error.code).to.be.equal('ERR_UNAUTHORIZED');
            expect(error.statusCode).to.be.equal(401);
            expect(error.meta).to.be.an('object');
        }
    });

    it(`calls the ${method} endpoint with parameter with token`, async () => {
        const data = await api[method]('/test/auth', { int: 1 }, { 'x-token': 'TOKEN' });
        expect(data).to.be.an('object');
        expect(data).to.be.an.instanceOf(DataResponse);
        expect(data).to.have.all.keys(['success']);
        expect(data.success).to.be.true;
        expect(data.statusCode).to.be.equal(200);
        expect(data.meta).to.be.an('object');
        expect(data.data).to.be.an('object');
    });

    it(`calls the ${method} endpoint with 204 response`, async () => {
        const data = await api[method]('/test/204');
        expect(data.isEmpty()).to.be.true;
        expect(data.meta).to.be.undefined;
    });

    // TODO version calls
};

describe('Start of the server', () => {

    it('starts the server', (done) => {
        app.start(done);
    });

    it('pings the server', async () => {
        await Connector({ url: URL }).ping();
    });
});

describe('Api calls Promises', () => {

    const connector = Connector({ url: URL });

    describe('GET', () => {

        calls('get');
    });

    describe('GET with version', () => {

        calls('get', connector.v(0));
    });

    describe('POST', () => {

        calls('post');
    });

    describe('POST with version', () => {

        calls('post', connector.v(0));
    });

    describe('PUT', () => {

        calls('put');
    });

    describe('PUT with version', () => {

        calls('put', connector.v(0));
    });

    describe('DELETE', () => {

        calls('delete');
    });

    describe('DELETE with version', () => {

        calls('delete', connector.v(0));
    });
});