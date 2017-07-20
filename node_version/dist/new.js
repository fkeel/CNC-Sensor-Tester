'use strict';

var EventEmitter = require('events');
var SerialPort = require('serialport');
var events = new EventEmitter();
var port = new SerialPort('COM4', { baudRate: 115200 });

var Readline = SerialPort.parsers.Readline;
var parser = port.pipe(new Readline());

parser.on('data', function (data) {
    events.emit('data', data);
});

var count = 0;
var onReady = function onReady(data) {
    if (count === 2) {
        events.removeListener('data', onReady);
        events.emit('ready');
    }
    count++;
};
events.on('data', onReady);

function Command(name, message, num) {
    return function () {
        return new Promise(function (resolve) {
            var count = 0;
            port.write(message);

            var callback = function callback(data) {
                console.log(name, count, data);
                if (count === num) {
                    events.removeListener('data', callback);
                    resolve(name + 'ed');
                }
                count++;
            };
            events.on('data', callback);
        });
    };
}

var unlock = new Command('unlock', '$X\n', 1);
var unit = new Command('unit', 'G21\n', 0);
var home = new Command('home', '$H\n', 0);
var status = new Command('status', '?', 0);

function move(x, y, z) {
    return new Promise(function (resolve) {
        var count = 0;
        port.write('G91\nG0\nX' + x + '\nY' + y + '\nZ' + z + '\n');
        var callback = function callback(data) {
            console.log('move', count, data);
            if (count >= 4) {
                if (data.slice(1, -1).split(',')[0].toLowerCase() !== 'idle') {
                    port.write('?');
                } else {
                    events.removeListener('data', callback);
                    resolve('moved');
                }
            }
            count++;
        };
        events.on('data', callback);
    });
}

events.on('ready', function () {
    unlock().then(function (res) {
        console.log(res);
        return unit();
    }).then(function (res) {
        console.log(res);
        return home();
    }).then(function (res) {
        console.log(res);
        return move(10, 10, -10);
    }).then(function (res) {
        console.log(res);
        return move(0, 0, 10);
    }).then(function (res) {
        console.log(res);
        return status();
    }).then(function (res) {
        console.log(res);
    });
});