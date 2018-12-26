'use strict';

const url = require('url');
const Client = require('./quiqpay/client');
const services = {
  orders: require('./quiqpay/orders')
};

Quiqpay.PACKAGE_VERSION = require('../package.json').version;
Quiqpay.API_VERSION = '1';
Quiqpay.DEFAULT_TIMEOUT = 2000;
Quiqpay.DEFAULT_BASE_URL = `http://localhost:2000/v${Quiqpay.API_VERSION}`;  // 'https://api.quiqpay.io';
Quiqpay.DEFAULT_USER_AGENT = 'quiqpay-node/' + Quiqpay.PACKAGE_VERSION;
Quiqpay.services = services;

function Quiqpay(attrs) {
  if (!(this instanceof Quiqpay)) {
    return new Quiqpay(attrs);
  }

  this._api = {
    accessToken: null,
    baseUrl: null,
    userAgent: null,
    test: null
  };

  this.VERSION = Quiqpay.PACKAGE_VERSION;
  this.client = new Client(this);
  this._setupServices();

  if (typeof attrs === 'object') {
    this.setAccessToken(attrs.accessToken);
  } else if (typeof attrs === 'string') {
    this.setAccessToken(attrs);
  }
  this.setTimeout(attrs.timeout);
  this.setBaseUrl(attrs.baseUrl);
  this.setUserAgent(attrs.userAgent);
  this.test(attrs.test);

  // Required for unit testing
  if (attrs.unitTest) {
    this.API_VERSION = Quiqpay.API_VERSION;
    this.DEFAULT_TIMEOUT = Quiqpay.DEFAULT_TIMEOUT;
    this.DEFAULT_BASE_URL = Quiqpay.DEFAULT_BASE_URL;
    this.DEFAULT_USER_AGENT = Quiqpay.DEFAULT_USER_AGENT;
  }

}

Quiqpay.prototype = {
  test: function(test) {
    if (test) {
      this._api.test = true;
    }
  },

  setTimeout: function(timeout) {
    this.timeout = timeout || Quiqpay.DEFAULT_TIMEOUT;
  },

  accessToken: function() {
    return this._api.accessToken;
  },

  setAccessToken: function(accessToken) {
    this._api.accessToken = accessToken;
  },

  baseUrl: function() {
    return this._api.baseUrl;
  },

  setBaseUrl: function(baseUrl) {
    this._api.baseUrl = url.parse(baseUrl || Quiqpay.DEFAULT_BASE_URL);
  },

  userAgent: function() {
    return this._api.userAgent;
  },

  setUserAgent: function(userAgent) {
    if (!userAgent) {
      this._api.userAgent = Quiqpay.DEFAULT_USER_AGENT;
    } else {
      this._api.userAgent = Quiqpay.DEFAULT_USER_AGENT + ' ' + userAgent;
    }
  },

  _setupServices: function() {
    for (var name in services) {
      this[name] = new services[name](this.client);
    }
  },
}

module.exports = Quiqpay;
