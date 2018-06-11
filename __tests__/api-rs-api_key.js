import { expect } from 'chai';
import rs, { Param, Type, HttpError } from 'resting-squirrel';

import Connector from '../src';
import Api from '../src/api';
import { DataResponse, ErrorResponse } from '../src/response';

const URL = 'http://localhost:8082';
const API_KEY = 'API_KEY';

const app = rs({
    port: 8082,
    log: false,
    logStack: false,
    apiKey: {
        enabled: true,
        validator: (apiKey, next) => {
            if (apiKey !== API_KEY) {
                next(HttpError.create(403));
                return;
            }
            next();
        },
    }
});

['get', 'post', 'put', 'delete'].forEach((method) => {
    app[method]('/test', (req, res, next) => next(null, { success: true }));
});


const calls = (method) => {

    it('calls the endpoint without api key', async () => {
        const connector = Connector({ url: URL });
        try {
            await connector[method]('/test');
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code']);
            expect(error.message).to.be.equal('Api key is missing.');
            expect(error.code).to.be.equal('ERR_MISSING_API_KEY');
            expect(error.statusCode).to.be.equal(403);
            expect(error.meta).to.be.an('object');
        }
    });

    it('calls the endpoint with invalid api key', async () => {
        const connector = Connector({ url: URL, apiKey: 'INVALID_API_KEY' });
        try {
            await connector[method]('/test');
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(ErrorResponse);
            expect(error).to.have.all.keys(['message', 'code']);
            expect(error.message).to.be.equal('Forbidden');
            expect(error.code).to.be.equal('ERR_FORBIDDEN');
            expect(error.statusCode).to.be.equal(403);
            expect(error.meta).to.be.an('object');
        }
    });

    it('calls the endpoint with valid api key', async () => {
        const connector = Connector({ url: URL, apiKey: 'API_KEY' });
        const data = await connector[method]('/test');
        expect(data).to.be.an('object');
        expect(data).to.be.an.instanceOf(DataResponse);
        expect(data).to.have.all.keys(['success']);
        expect(data.success).to.be.true;
        expect(data.statusCode).to.be.equal(200);
        expect(data.meta).to.be.an('object');
    });
};

describe('Calls with api key', () => {

    describe('Start of the server', () => {

        it('starts the server', (done) => {
            app.start(done);
        });
    });

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