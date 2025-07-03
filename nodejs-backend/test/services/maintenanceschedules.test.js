const assert = require('assert');
const app = require('../../src/app');

describe('\'maintenanceschedules\' service', () => {
  it('registered the service', () => {
    const service = app.service('maintenanceschedules');

    assert.ok(service, 'Registered the service (maintenanceschedules)');
  });
});
