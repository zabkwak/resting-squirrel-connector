# resting-squirrel-connector
[Resting Squirrel](https://www.npmjs.com/package/resting-squirrel) connector.

## Installation
```bash
npm i --save resting-squirrel-connector
```

## Usage
### Callbacks
```javascript
import connector from 'resting-squirrel-connector';

const api = connector({ url: 'https://some.url.com' });

// Calls the Resting Squirrel API endpoint at https://some.url.com/test without any parameters or headers
api.get('/test', (err, data, meta) => {
    // do some stuff
});

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test without any parameters or headers
api.v(1).get('/test', (err, data, meta) => {
    // do some stuff
});

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test?test=test without headers
api.v(1).get('/test', { test: 'test' }, (err, data, meta) => {
    // do some stuff
});

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test with POST body {"test":"test"} without headers
api.v(1).post('/test', { test: 'test' }, (err, data, meta) => {
    // do some stuff
});

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test?test=test with headers test: 'test'
api.v(1).get('/test', { test: 'test' }, { test: 'test' }, (err, data, meta) => {
    // do some stuff
});
```
### Promises
```javascript
import connector from 'resting-squirrel-connector';

const api = connector({ url: 'https://some.url.com' });

// Calls the Resting Squirrel API endpoint at https://some.url.com/test without any parameters or headers
const data = await api.get('/test');

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test without any parameters or headers
const data = await api.v(1).get('/test');

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test?test=test without headers
const data = await api.v(1).get('/test', { test: 'test' });

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test with POST body {"test":"test"} without headers
const data = await api.v(1).post('/test', { test: 'test' });

// Calls the Resting Squirrel API endpoint at https://some.url.com/1/test?test=test with headers test: 'test'
const data = await api.v(1).get('/test', { test: 'test' }, { test: 'test' });
```

## Config
The module's function receives `Config` data where the `url` is required.  
**url** The URL of the Resting Squirrel API.  
**dataKey** Key which contains data informations in the response. Default: 'data'.  
**errorKey** Key which contains error informations in the response. Default: 'error'.  
**meta** If true meta data are returned in the response. Default: true.  
**apiKey** The api key to validates calls on the API. Default: null.  
**concurrency** The count of the simultaneously running requests. Default: 200.  

## Methods
The module is `Api` instance which has base http methods (`get`, `post`, `put`, `delete`) which call the http method on the RS API without a version of the endpoint. All methods are using same parameters.  
**endpoint** Endpoint on the API.  
**params** Parameters to send to the API. If the method is `get` the params are sent as querystring otherwise the params are in `JSON` body.  
**headers** Headers to send to the API.  
**callback** Function to handle error or data. The params are `error`, `data` and `meta`.  
*error* Object with `message` and `code`.  
*data* Data from the API. It can be anything.  
*meta* Meta data of the request.  

To use a version in calls the `v` method must be called with desired number of the version. 
```javascript
import connector from 'resting-squirrel-connector';

const api = connect({ url: 'https://some.url.com' });

api.v(1).get('/test', (err, data, meta) => {
    // do some stuff
});
```