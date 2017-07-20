'use strict';

var _keypress = require('keypress');

var _keypress2 = _interopRequireDefault(_keypress);

var _CNC = require('./CNC');

var _CNC2 = _interopRequireDefault(_CNC);

var _Sensor = require('./Sensor');

var _Sensor2 = _interopRequireDefault(_Sensor);

var _IterablePromise = require('./IterablePromise');

var _IterablePromise2 = _interopRequireDefault(_IterablePromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cnc = new _CNC2.default('COM4', { baudRate: 115200 });
var sensor = new _Sensor2.default('COM1', '../test.csv', { baudRate: 9600 });

function moveToAndRead(x, y, z, maxDepth) {
  return new Promise(function (resolve) {
    var read = null;
    cnc.moveTo(x, y, z).then(function () {
      return sensor.read();
    }).then(function (data) {
      read = data;
      return cnc.moveTo(x, y, maxDepth);
    }).then(function () {
      resolve(read);
    });
  });
}

var moves = _IterablePromise2.default.createMultiple(moveToAndRead, [[10, 10, -70], [20, 20, -70], [30, 30, -70]], [-65]);

Promise.all([cnc.ready(), sensor.ready()]).then(function () {
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
  return _IterablePromise2.default.iterate(moves);
}).then(function (data) {
  console.log(data);
});

cnc.start();
sensor.start();

var moveDistance = 1.0;

(0, _keypress2.default)(process.stdin);
process.stdin.on('keypress', function (ch, key) {
  // CTRL-C to exit
  if (key && key.ctrl && key.name === 'c') process.exit();

  // arrow keys moves the x,y axis on the CNC
  if (key.name === 'left') cnc.move(-moveDistance, 0, 0);
  if (key.name === 'up') cnc.move(0, moveDistance, 0);
  if (key.name === 'right') cnc.move(moveDistance, 0, 0);
  if (key.name === 'down') cnc.move(0, -moveDistance, 0);

  // pageup, pagedown moves the z axis on the CNC
  if (key.name === 'pageup') cnc.move(0, 0, moveDistance);
  if (key.name === 'pagedown') cnc.move(0, 0, -moveDistance);
});

process.stdin.setRawMode(true);
process.stdin.resume();