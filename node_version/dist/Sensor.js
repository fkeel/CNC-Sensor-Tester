'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs.extra');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _serialport = require('serialport');

var _serialport2 = _interopRequireDefault(_serialport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Readline = _serialport2.default.parsers.Readline;

var Sensor = function () {
  function Sensor(com, filePath, options) {
    var _this = this;

    _classCallCheck(this, Sensor);

    this.port = new _serialport2.default(com, options);
    this.filePath = _path2.default.resolve(__dirname, filePath);
    this.events = new _events2.default();
    var parser = this.port.pipe(new Readline());
    parser.on('data', function (data) {
      _this.events.emit('data', data);
    });
  }

  _createClass(Sensor, [{
    key: 'createLog',
    value: function createLog() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var input = _path2.default.resolve(__dirname, '../log.template');

        _fs2.default.copy(input, _this2.filePath, { replace: true }, function (err) {
          if (err) reject();
          resolve();
        });
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      var callback = function callback(data) {
        if (data === 'ok\r') {
          _this3.events.removeListener('data', callback);
          _this3.events.emit('ready');
        }
      };
      this.events.on('data', callback);
    }
  }, {
    key: 'ready',
    value: function ready() {
      var _this4 = this;

      return new Promise(function (resolve) {
        _this4.events.on('ready', function () {
          _this4.createLog().then(function () {
            resolve();
          });
        });
      });
    }
  }, {
    key: 'read',
    value: function read() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.port.write('A');
        var callback = function callback(data) {
          data = data.trim();
          _this5.events.removeListener('data', callback);
          _fs2.default.appendFile(_this5.filePath, data + '\r\n', function (err) {
            if (err) reject(err);
            resolve(data.split(',').map(function (value) {
              return parseInt(value.trim());
            }));
          });
        };
        _this5.events.on('data', callback);
      });
    }
  }]);

  return Sensor;
}();

exports.default = Sensor;