import { expect } from 'chai';

import { ErrorResponse, DataResponse } from '../src/response';

describe('ErrorResponse', () => {

    describe('Instance', () => {

        it('checks the default instance', () => {
            const error = new ErrorResponse(400, { message: 'Bad request.', code: 'ERR_BAD_REQUEST' });
            expect(error).to.have.all.keys(['message', 'code']);
            const { message, code } = error;
            expect(message).to.be.equal('Bad request.');
            expect(code).to.be.equal('ERR_BAD_REQUEST');
        });

        it('checks the instance with payload', () => {
            const error = new ErrorResponse(400, { message: 'Bad request.', code: 'ERR_BAD_REQUEST', field: 'name' });
            expect(error).to.have.all.keys(['message', 'code', 'field']);
            const { message, code, field } = error;
            expect(message).to.be.equal('Bad request.');
            expect(code).to.be.equal('ERR_BAD_REQUEST');
            expect(field).to.be.equal('name');
        });
    })
});