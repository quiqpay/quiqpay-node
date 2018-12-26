'use strict';

const testUtils = require('./settings');
// test string accessToken
let quiqpay = require('../lib/quiqpay')(testUtils.getAccessToken());
const chai = require('chai');
const expect = chai.expect;

describe('QuiqPay Module', () => {

  describe('String accessToken - Check access token has been set when initilized', () => {
    it('Get the access token', () => {
      expect(quiqpay.accessToken()).to.equal(testUtils.getAccessToken());
    });
  });

  // test object setAccessToken
  quiqpay = require('../lib/quiqpay')({
    accessToken: testUtils.getAccessToken(),
    unitTest: true,
    test: true
  });

  describe('Object accessToken - Check access token has been set when initilized', () => {
    it('Get the access token', () => {
      expect(quiqpay.accessToken()).to.equal(testUtils.getAccessToken());
    });
  });

  describe('setAccessToken =>', () => {
    it('Set the access token', () => {
      quiqpay.setAccessToken('abc123');
      expect(quiqpay.accessToken()).to.equal('abc123');
    });
  });

  describe('setUserAgent =>', () => {
    it('check default User-Agent', () => {
      expect(quiqpay.userAgent()).to.equal(quiqpay.DEFAULT_USER_AGENT);
    });

    it('set a custom User-Agent', () => {
      quiqpay.setUserAgent('my-app');
      expect(quiqpay.userAgent()).to.equal(quiqpay.DEFAULT_USER_AGENT + ' my-app');
    });
  });

  describe('setTimeout =>', () => {
    it('check default timeout', () => {
      expect(quiqpay.timeout).to.equal(quiqpay.DEFAULT_TIMEOUT);
    });

    it('set custom timeout', () => {
      const timeout = 3333;
      quiqpay.setTimeout(timeout);
      expect(quiqpay.timeout).to.equal(timeout);
    });
  });

  describe('setBaseUrl =>', () => {
    it('check default baseUrl', () => {
      expect(quiqpay.baseUrl().href).to.equal(quiqpay.DEFAULT_BASE_URL);
    });

    it('check custom baseUrl', () => {
      const url = 'http://test.quiqpay.io/api';
      quiqpay.setBaseUrl(url);
      expect(quiqpay._api.baseUrl.href).to.equal(url);
    });
  });

});
