const assert = require('assert');
const app = require('../../src/app');

describe('\'technicians\' service', () => {
  it('registered the service', () => {
    const service = app.service('technicians');

    assert.ok(service, 'Registered the service (technicians)');
  });
});
