'use strict';

var _CNC = require('./CNC');

var _CNC2 = _interopRequireDefault(_CNC);

var _Sensor = require('./Sensor');

var _Sensor2 = _interopRequireDefault(_Sensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keypress = require('keypress');

var cnc = new _CNC2.default('COM4', { baudRate: 115200 });
var sensor = new _Sensor2.default('COM1', { baudRate: 9600 });

function moveAndRead(x, y, z) {
    return new Promise(function (resolve) {
        var read = null;
        cnc.move(x, y, z).then(function () {
            return sensor.read();
        }).then(function (data) {
            read = data;
            return cnc.move(0, 0, -z);
        }).then(function () {
            resolve(read);
        });
    });
}

Promise.all([cnc.ready(), sensor.read()]).then(function () {
    console.log('ready');
    return cnc.unlock();
}).then(function (res) {
    console.log(res);
    return cnc.unit();
}).then(function (res) {
    console.log(res);
    return cnc.home();
}).then(function (res) {
    console.log(res);
    return moveAndRead(10, 10, -10);
}).then(function (res) {
    console.log(res);
    return cnc.moveTo(20, 20, -10);
}).then(function (data) {
    console.log(data);
});

cnc.start();
sensor.start();

var moveDistance = 1.0;

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') process.exit();;

    if (key.name === 'left') cnc.move(-moveDistance, 0, 0);
    if (key.name === 'up') cnc.move(0, moveDistance, 0);
    if (key.name === 'right') cnc.move(moveDistance, 0, 0);
    if (key.name === 'down') cnc.move(0, -moveDistance, 0);

    if (key.name === 'pageup') cnc.move(0, 0, moveDistance);
    if (key.name === 'pagedown') cnc.move(0, 0, -moveDistance);
});

process.stdin.setRawMode(true);
process.stdin.resume();