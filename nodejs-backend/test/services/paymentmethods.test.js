const assert = require('assert');
const app = require('../../src/app');

describe('\'paymentmethods\' service', () => {
  it('registered the service', () => {
    const service = app.service('paymentmethods');

    assert.ok(service, 'Registered the service (paymentmethods)');
  });
});
