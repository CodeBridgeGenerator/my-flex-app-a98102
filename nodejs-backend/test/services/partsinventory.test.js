const assert = require('assert');
const app = require('../../src/app');

describe('\'partsinventory\' service', () => {
  it('registered the service', () => {
    const service = app.service('partsinventory');

    assert.ok(service, 'Registered the service (partsinventory)');
  });
});
