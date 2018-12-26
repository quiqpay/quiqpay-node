'use strict';

/**
 * Provides access to the QuiqPay API.
 *
 * @see https://developer.quiqpay.io/v1/orders
 */
class Orders {
  constructor(client) {
    this._client = client;
  }

  create(data, options = {}) {
    return this._client.post(`/order/new`, data, options);
  }

}

module.exports = Orders;
