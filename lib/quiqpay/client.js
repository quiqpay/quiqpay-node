'use strict';

const axios = require('axios');

/**
 * An instance of the Client class provides low level HTTP wrapper methods.
 *
 * The service-specific classes delegate to an instance of Client to handle
 * the calls to the QuiqPay API.
 */
class Client {
  constructor(quiqpay) {
    this._quiqpay = quiqpay;
  }

  baseUrl() {
    return this._quiqpay.baseUrl();
  }

  get(path, options) {
    return this.request('GET', path, null, options);
  }

  post(path, data, options) {
    return this.request('POST', path, data, options);
  }

  put(path, data, options) {
    return this.request('PUT', path, data, options);
  }

  patch(path, data, options) {
    return this.request('PATCH', path, data, options);
  }

  delete(path, options) {
    return this.request('DELETE', path, null, options);
  }

  request(method, path, data, options) {
    if (options.test || this._quiqpay._api.test) {
      data.test = true;
    }

    axios.defaults.baseURL = this._quiqpay.baseUrl().href;
    axios.defaults.timeout = this._quiqpay.timeout;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this._quiqpay.accessToken();
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['User-Agent'] = this._quiqpay.userAgent();

    return new Promise((resolve, reject) => {
      axios.interceptors.response.use(res => {
        this._responseHandler(res, resolve, reject);
      }, error => {
        this._errorHandler(error, reject);
      });

      axios({
        method: method,
        url: path,
        data
      });
    });

  }

  _responseHandler(res, resolve, reject) {
    try {
      if (res.status === 204) {
        return resolve({});
      } else if (res.status >= 200 && res.status < 300) {
        return resolve(res.data);
      }
    }
    catch (e) {
      return reject(e);
    }
  }

  _errorHandler(error, reject) {
    try {
      if (error.code === 'ECONNABORTED' || error.response.status === 408) {
        // ECONNABORTED is also thrown when axios is manually aborted e.g. .abort() - need cater for this
        if (error.code === 'ECONNABORTED') {
          // timeout error - package/user setting too low
          var data = {
            error: error.message,
            description: 'Request has exceeded package timeout setting. May need to increase the default timeout',
            documentation: 'https://developer.quiqpay.io/'
          };
          return reject(data);

        } else {

          let data = {};
          if (error.response.data) {
            data = error.response.data;
          }
          data.description = 'Request timeout by QuiqPay server.';
          return reject(data);

        }
      } else if (error.response.status === 401) {
        var data = error.response.data;
        data.description = 'Authentication error';
        return reject(data);
      } else if (error.response.status === 404) {
        var data = error.response.data;
        data.description = 'Not found';
        return reject(data);
      } else if (error.response.status === 405) {
        return reject({description: 'Method not allowed'});
      } else if (error.response.status === 429) {
        return reject({description: 'Too many requests'});
      } else if (error.response.status >= 400 && error.response.status < 500) {
        var data = error.response.data;
        data.description = 'Bad request';
        return reject(data);
      } else if (error.response.status === 500) {
        return reject({description: 'Server fault. Try again later.', api_status: { twitter: 'https://twitter.com/quiqpay_status', url: 'https://api.quiqpay.io/status'}})
      } else {
        return reject(`Unsupported status code: ${res.status}`);
      }

    } catch (e) {
      var errorObj = {
        description: 'An error occurred communicating with QuiqPay API',
        error: e
      };
      return reject(errorObj);
    }
  }

}

module.exports = Client;
