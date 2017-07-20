'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events');
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;

var CNC = function () {
    function CNC(com, options) {
        var _this = this;

        _classCallCheck(this, CNC);

        this.port = new SerialPort(com, options);
        this.events = new EventEmitter();
        var parser = this.port.pipe(new Readline());
        parser.on('data', function (data) {
            _this.events.emit('data', data);
        });

        this.position = { 'x': 0, 'y': 0, 'z': 0 };
    }

    _createClass(CNC, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            var count = 0;
            var callback = function callback(data) {
                if (count === 2) {
                    _this2.events.removeListener('data', callback);
                    _this2.events.emit('ready');
                }
                count++;
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
        key: 'command',
        value: function command(name, message, num) {
            var _this4 = this;

            return new Promise(function (resolve) {
                var count = 0;
                _this4.port.write(message);

                var callback = function callback(data) {
                    //console.log(name, count, data);
                    if (count === num) {
                        _this4.events.removeListener('data', callback);
                        resolve(name + 'ed');
                    }
                    count++;
                };
                _this4.events.on('data', callback);
            });
        }
    }, {
        key: 'unlock',
        value: function unlock() {
            return this.command('unlock', '$X\n', 1);
        }
    }, {
        key: 'unit',
        value: function unit() {
            return this.command('unit', 'G21\n', 0);
        }
    }, {
        key: 'home',
        value: function home() {
            return this.command('home', '$H\n', 0);
        }
    }, {
        key: 'status',
        value: function status() {
            return this.command('status', '?', 0);
        }
    }, {
        key: 'move',
        value: function move(x, y, z) {
            var _this5 = this;

            return new Promise(function (resolve) {
                var count = 0;
                _this5.port.write('G91\nG0\nX' + x + '\nY' + y + '\nZ' + z + '\n');
                var callback = function callback(data) {
                    //console.log('move', count, data);
                    if (count >= 4) {
                        if (data.slice(1, -1).split(',')[0].toLowerCase() !== 'idle') {
                            _this5.port.write('?');
                        } else {
                            _this5.events.removeListener('data', callback);
                            _this5.position.x = parseFloat(data.split(',')[1].slice(5, -1));
                            _this5.position.y = parseFloat(data.split(',')[2]);
                            _this5.position.z = parseFloat(data.split(',')[3]);

                            //console.log(this.position);
                            resolve('moveed');
                        }
                    }
                    count++;
                };
                _this5.events.on('data', callback);
            });
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y, z) {
            return this.move(x - this.position.x, y - this.position.y, z - this.position.z);
        }
    }]);

    return CNC;
}();

exports.default = CNC;