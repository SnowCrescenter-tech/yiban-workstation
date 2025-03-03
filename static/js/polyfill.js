/**
 * 兼容性脚本
 * 为不支持现代JavaScript特性的浏览器提供兼容
 */

(function() {
  // 报告加载状态
  console.log('Polyfills loaded successfully');
  console.log('兼容性脚本已加载');
  
  // 错误处理
  window.reportError = function(error) {
    console.log('页面发生错误', error);
  };
  
  // 为不支持的浏览器添加Promise polyfill
  if (typeof Promise === 'undefined') {
    console.log('添加Promise兼容支持');
    // 简单的Promise polyfill实现
    // 实际项目中应使用完整的polyfill库如es6-promise
    window.Promise = function(executor) {
      var self = this;
      self.status = 'pending';
      self.value = undefined;
      self.reason = undefined;
      self.onResolvedCallbacks = [];
      self.onRejectedCallbacks = [];

      function resolve(value) {
        if (self.status === 'pending') {
          self.status = 'fulfilled';
          self.value = value;
          self.onResolvedCallbacks.forEach(function(fn) {
            fn();
          });
        }
      }

      function reject(reason) {
        if (self.status === 'pending') {
          self.status = 'rejected';
          self.reason = reason;
          self.onRejectedCallbacks.forEach(function(fn) {
            fn();
          });
        }
      }

      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    };

    Promise.prototype.then = function(onFulfilled, onRejected) {
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value) { return value; };
      onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason; };
      
      var self = this;
      var promise2 = new Promise(function(resolve, reject) {
        if (self.status === 'fulfilled') {
          setTimeout(function() {
            try {
              var x = onFulfilled(self.value);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (self.status === 'rejected') {
          setTimeout(function() {
            try {
              var x = onRejected(self.reason);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (self.status === 'pending') {
          self.onResolvedCallbacks.push(function() {
            setTimeout(function() {
              try {
                var x = onFulfilled(self.value);
                resolve(x);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
          self.onRejectedCallbacks.push(function() {
            setTimeout(function() {
              try {
                var x = onRejected(self.reason);
                resolve(x);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
        }
      });

      return promise2;
    };

    Promise.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };

    Promise.resolve = function(value) {
      return new Promise(function(resolve) {
        resolve(value);
      });
    };

    Promise.reject = function(reason) {
      return new Promise(function(resolve, reject) {
        reject(reason);
      });
    };

    Promise.all = function(promises) {
      return new Promise(function(resolve, reject) {
        var result = [];
        var count = 0;
        if (promises.length === 0) {
          resolve(result);
        } else {
          for (var i = 0; i < promises.length; i++) {
            (function(i) {
              Promise.resolve(promises[i]).then(function(value) {
                result[i] = value;
                count++;
                if (count === promises.length) {
                  resolve(result);
                }
              }, function(reason) {
                reject(reason);
              });
            })(i);
          }
        }
      });
    };
  }
  
  // 为不支持的浏览器添加Fetch polyfill
  if (typeof fetch === 'undefined') {
    console.log('添加Fetch兼容支持');
    // 简单的fetch polyfill声明
    // 实际项目中应使用完整的polyfill库如whatwg-fetch
    window.fetch = function(url, options) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        options = options || {};
        options.method = options.method || 'GET';
        options.headers = options.headers || {};
        
        xhr.open(options.method, url);
        
        for (var header in options.headers) {
          if (options.headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, options.headers[header]);
          }
        }
        
        xhr.onload = function() {
          var response = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders())
          };
          
          response.url = 'responseURL' in xhr ? xhr.responseURL : options.url;
          
          var body = 'response' in xhr ? xhr.response : xhr.responseText;
          
          resolve(new Response(body, response));
        };
        
        xhr.onerror = function() {
          reject(new TypeError('网络请求失败'));
        };
        
        xhr.ontimeout = function() {
          reject(new TypeError('网络请求超时'));
        };
        
        xhr.send(options.body || null);
      });
    };
    
    function parseHeaders(rawHeaders) {
      var headers = new Headers();
      var preProcessedHeaders = rawHeaders.trim().split(/[\r\n]+/);
      
      preProcessedHeaders.forEach(function(line) {
        var parts = line.split(': ');
        var key = parts.shift();
        var value = parts.join(': ');
        headers.append(key, value);
      });
      
      return headers;
    }
    
    window.Headers = function() {
      this.map = {};
    };
    
    Headers.prototype.append = function(name, value) {
      this.map[name.toLowerCase()] = value;
    };
    
    Headers.prototype.get = function(name) {
      return this.map[name.toLowerCase()] || null;
    };
    
    window.Response = function(body, options) {
      this.body = body;
      this.type = 'default';
      this.url = options.url;
      this.status = options.status;
      this.statusText = options.statusText || '';
      this.headers = options.headers;
      this._bodyInit = body;
    };
    
    Response.prototype.json = function() {
      return Promise.resolve(JSON.parse(this.body));
    };
    
    Response.prototype.text = function() {
      return Promise.resolve(this.body);
    };
  }
  
  // 为不支持的浏览器添加Object.assign polyfill
  if (typeof Object.assign !== 'function') {
    console.log('添加Object.assign兼容支持');
    Object.assign = function(target, ...sources) {
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      const to = Object(target);
      
      for (let source of sources) {
        if (source !== null && source !== undefined) {
          for (let key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              to[key] = source[key];
            }
          }
        }
      }
      
      return to;
    };
  }
  
  // 为不支持的浏览器添加Array.from polyfill
  if (!Array.from) {
    console.log('添加Array.from兼容支持');
    Array.from = function(arrayLike, mapFn, thisArg) {
      if (arrayLike === null || arrayLike === undefined) {
        throw new TypeError('Array.from requires an array-like object');
      }
      
      const array = [];
      const length = arrayLike.length >>> 0;
      
      for (let i = 0; i < length; i++) {
        if (i in arrayLike) {
          let element = arrayLike[i];
          if (mapFn) {
            element = mapFn.call(thisArg, element, i);
          }
          array[i] = element;
        }
      }
      
      return array;
    };
  }
  
  // 为不支持 Array.prototype.find 的浏览器添加支持
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function(predicate) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        
        var thisArg = arguments[1];
        var k = 0;
        
        while (k < len) {
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          k++;
        }
        
        return undefined;
      },
      configurable: true,
      writable: true
    });
  }

  // 为不支持 NodeList.prototype.forEach 的浏览器添加支持
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  
  // 全局错误捕获，用于开发调试
  window.addEventListener('error', function(event) {
    window.reportError({
      message: event.error ? event.error.message : event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
})();
