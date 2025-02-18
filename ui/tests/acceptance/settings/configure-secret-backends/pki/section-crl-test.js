/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { currentRouteName, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { v4 as uuidv4 } from 'uuid';

import page from 'vault/tests/pages/settings/configure-secret-backends/pki/section';
import authPage from 'vault/tests/pages/auth';
import enablePage from 'vault/tests/pages/settings/mount-secret-backend';

module('Acceptance | settings/configure/secrets/pki/crl', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.uid = uuidv4();
    return authPage.login();
  });

  test('it saves crl config', async function (assert) {
    const path = `pki-crl-${this.uid}`;
    await enablePage.enable('pki', path);
    await settled();
    await page.visit({ backend: path, section: 'crl' });
    await settled();
    assert.strictEqual(currentRouteName(), 'vault.cluster.settings.configure-secret-backend.section');
    await page.form.fillInUnit('h');
    await page.form.fillInValue(3);
    await page.form.submit();
    await settled();
    assert.strictEqual(page.lastMessage, 'The crl config for this backend has been updated.');
  });
});
