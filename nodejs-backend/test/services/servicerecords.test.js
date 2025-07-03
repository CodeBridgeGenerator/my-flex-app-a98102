const assert = require('assert');
const app = require('../../src/app');

describe('\'servicerecords\' service', () => {
  it('registered the service', () => {
    const service = app.service('servicerecords');

    assert.ok(service, 'Registered the service (servicerecords)');
  });
});
