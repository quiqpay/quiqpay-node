'use strinct';

require('mocha');

const utils = {
  getAccessToken: function() {
    let key = process.env.TOKEN || 'satoshi';
    return key
  }
}

module.exports = utils;
