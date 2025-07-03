const assert = require('assert');
const app = require('../../src/app');

describe('\'loyaltyprograms\' service', () => {
  it('registered the service', () => {
    const service = app.service('loyaltyprograms');

    assert.ok(service, 'Registered the service (loyaltyprograms)');
  });
});
