import { expect } from 'chai';
import rs, { Param, Type, Field } from 'resting-squirrel';

import Connector from '../src';
import Builder from '../src/builder';

const URL = 'http://localhost:8084';

const app = rs({
	port: 8084,
	log: false,
	logStack: false,
	auth: {
		key: 'authorization',
		async validator() {
			return true;
		},
	},
});

app.get('/', { response: null, params: [new Param('test', true, Type.string)] }, async ({ query }) => query);


app.get('/:id', { response: null, params: [new Param('test', true, Type.string)], args: [new Field('id', Type.integer)] }, async ({ query, params }) => {
	return {
		...query,
		...params,
	};
});

const Api = Connector({ url: URL });

describe('Start of the server', () => {

	it('starts the server', (done) => {
		app.start(done);
	});
});

describe('Builder', () => {

	it('calls the base endpoint with builder', async () => {
		const builder = Api.Builder;
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/')
			.addParam('test', 'test')
			.sign('authorization', 'TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test']);
		expect(data.test).to.be.equal('test');
	});

	it ('calls the arguments defined endpoint', async () => {
		const builder = Api.Builder;
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/1')
			.addParam('test', 'test')
			.sign('authorization', 'TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test', 'id']);
		expect(data.test).to.be.equal('test');
		expect(data.id).to.be.equal(1);
	});

	it ('calls the arguments defined endpoint with template', async () => {
		const builder = Api.Builder;
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/:id')
			.addArgument('id', 1)
			.addParam('test', 'test')
			.sign('authorization', 'TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test', 'id']);
		expect(data.test).to.be.equal('test');
		expect(data.id).to.be.equal(1);
	});
});

describe('Request', () => {

	it('calls the base endpoint with request', async () => {
		const builder = new Api.Request('authorization');
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/')
			.addParam('test', 'test')
			.sign('TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test']);
		expect(data.test).to.be.equal('test');
	});

	it ('calls the arguments defined endpoint', async () => {
		const builder = new Api.Request('authorization');
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/1')
			.addParam('test', 'test')
			.sign('TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test', 'id']);
		expect(data.test).to.be.equal('test');
		expect(data.id).to.be.equal(1);
	});

	it ('calls the arguments defined endpoint with template', async () => {
		const builder = new Api.Request('authorization');
		expect(builder).to.be.instanceOf(Builder);
		const data = await builder
			.get('/:id')
			.addArgument('id', 1)
			.addParam('test', 'test')
			.sign('TOKEN')
			.execute();
		expect(data).to.have.all.keys(['test', 'id']);
		expect(data.test).to.be.equal('test');
		expect(data.id).to.be.equal(1);
	});
});