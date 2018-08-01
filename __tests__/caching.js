import { expect } from 'chai';
import rs from 'resting-squirrel';
import async from 'async';

import Connector from '../src';

const URL = 'http://localhost:8083';

const app = rs({
    port: 8083,
    log: false,
    logStack: false
});

app.get('/', { response: null }, (req, res, next) => next());

const Api = Connector({ url: URL });

describe('Start of the server', () => {

    it('starts the server', (done) => {
        app.start(done);
    });
});

describe('Caching', () => {

    it('sends several same requests to the API', (done) => {

        async.each(new Array(5000), (item, callback) => {
            Api.get('/', callback);
        }, (err) => {
            expect(err).to.be.null;
            done();
        });
    });
});