"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IterablePromise = function () {
  function IterablePromise(promiseFunction) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    _classCallCheck(this, IterablePromise);

    this.promiseFunction = function () {
      return promiseFunction.apply(undefined, params);
    };
  }

  _createClass(IterablePromise, [{
    key: "getPromise",
    value: function getPromise() {
      return this.promiseFunction();
    }
  }], [{
    key: "iterate",
    value: function iterate(iterablePromises) {
      return new Promise(function (resolve) {
        var promisesData = [];
        (function iterator(index) {
          var iterablePromise = iterablePromises[index++];
          iterablePromise.getPromise().then(function (data) {
            promisesData.push(data);
            if (index < iterablePromises.length) {
              iterator(index);
            } else if (index === iterablePromises.length) {
              resolve(promisesData);
            }
          });
        })(0);
      });
    }
  }, {
    key: "createMultiple",
    value: function createMultiple(promiseFunction, paramsArray, contants) {
      return paramsArray.map(function (params) {
        return new (Function.prototype.bind.apply(IterablePromise, [null].concat([promiseFunction], _toConsumableArray(params), _toConsumableArray(contants))))();
      });
    }
  }]);

  return IterablePromise;
}();

exports.default = IterablePromise;