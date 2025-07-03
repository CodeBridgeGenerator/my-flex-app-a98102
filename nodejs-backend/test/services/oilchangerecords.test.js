const assert = require('assert');
const app = require('../../src/app');

describe('\'oilchangerecords\' service', () => {
  it('registered the service', () => {
    const service = app.service('oilchangerecords');

    assert.ok(service, 'Registered the service (oilchangerecords)');
  });
});
