'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events');
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;

var Sensor = function () {
    function Sensor(com, options) {
        var _this = this;

        _classCallCheck(this, Sensor);

        this.port = new SerialPort(com, options);
        this.events = new EventEmitter();
        var parser = this.port.pipe(new Readline());
        parser.on('data', function (data) {
            _this.events.emit('data', data);
        });
    }

    _createClass(Sensor, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            var callback = function callback(data) {
                if (data === 'ok\r') {
                    _this2.events.removeListener('data', callback);
                    _this2.events.emit('ready');
                }
            };
            this.events.on('data', callback);
        }
    }, {
        key: 'ready',
        value: function ready() {
            var _this3 = this;

            return new Promise(function (resolve) {
                _this3.events.on('ready', resolve);
            });
        }
    }, {
        key: 'read',
        value: function read() {
            var _this4 = this;

            return new Promise(function (resolve) {
                _this4.port.write('A');
                var callback = function callback(data) {
                    _this4.events.removeListener('data', callback);
                    resolve(data);
                };
                _this4.events.on('data', callback);
            });
        }
    }]);

    return Sensor;
}();

exports.default = Sensor;