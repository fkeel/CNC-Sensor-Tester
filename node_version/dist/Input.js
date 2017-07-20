'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keypress = require('keypress');

var Input = function () {
    function Input(cnc, sensor) {
        _classCallCheck(this, Input);

        this.cnc = cnc;
        this.sensor = sensor;
        this.moveDistance = 1.0;
        console.log(this.cnc);
    }

    _createClass(Input, [{
        key: 'activate',
        value: function activate() {
            keypress(process.stdin);

            process.stdin.on('keypress', function (ch, key) {
                console.log(key);
                if (key.name === 'left') this.cnc.move(-this.moveDistance, 0, 0);
                if (key.name === 'up') this.cnc.move(0, this.moveDistance, 0);
                if (key.name === 'right') this.cnc.move(this.moveDistance, 0, 0);
                if (key.name === 'down') this.cnc.move(0, -this.moveDistance, 0);

                if (key.name === 'pageup') this.cnc.move(0, 0, this.moveDistance);
                if (key.name === 'pagedown') this.cnc.move(0, 0, -this.moveDistance);
            });

            process.stdin.setRawMode(true);
            process.stdin.resume();
        }
    }]);

    return Input;
}();

exports.default = Input;