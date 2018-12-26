# QuiqPay Node.js Library

The QuiqPay Node library provides convenient access to the QuiqPay API from applications written in server-side JavaScript.

This library uses promises exclusively, thus all server calls that to our API will return a Promise.

This library is a promised based, thus requires Node v6.0.0+

Please keep in mind that this package is for use with server-side Node that uses QuiqPay secret keys.

## Requirements

The QuiqPay Node library requires Node.js v6.0.0+.

## Documentation

See the [Node API docs](https://developer.quiqpay.io).

## Installation

Install the package with:

    npm install quiqpay --save

## Usage

The package needs to be configured with your account's secret key which is
available in your [QuiqPay Dashboard](https://app.quiqpay.io/api). Require it with the key's
value:

``` js
const quiqpay = require('quiqpay')('sk_test_...');

const order = await quiqpay.order.create({
  firstName: 'Satoshi',
  lastName: 'Nakamoto',
  email: 'satoshi@nakamoto.bitcoin',
  baseCurrency: 'USD',
  amount: 50
});
```
