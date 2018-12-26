'use strict';

const testUtils = require('../settings');
const quiqpay = require('../../lib/quiqpay')({
    accessToken: testUtils.getAccessToken(),
    unitTest: true,
    test: true
});
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

describe('Client Resonse Handler', () => {
  describe('Check POST with status: 200', () => {
    it('POST 200', () => {
      const reply = require('../http.responses/responseHandler/200');
      nock('http://localhost:2000/v1') // pull from lib/quiqpay.js
        .post('/user/new', {})
        .reply(200, reply);

        quiqpay.orders.create({
          firstName: 'test',
          lastName: 'test'
        }).then(res => {
          console.log(`res: ${res}`);
        }).catch(e => {
          console.log(e);
        });
    });
  });
});
