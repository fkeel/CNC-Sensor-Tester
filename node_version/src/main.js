import CNC from './CNC';
import Sensor from './Sensor';

var keypress = require('keypress');

const cnc = new CNC('COM4', {baudRate: 115200});
const sensor = new Sensor('COM1', {baudRate: 9600});

function moveAndRead(x, y, z) {
    return new Promise(resolve => {
        let read = null;
        cnc.move(x, y, z).then(() => {
            return sensor.read();
        }).then((data) => {
            read = data;
            return cnc.move(0, 0, -z);
        }).then(() => {
            resolve(read);
        })
    })
}

Promise.all([
    cnc.ready(),
    sensor.read()
]).then(() => {
    console.log('ready');
    return cnc.unlock();
}).then(res => {
    console.log(res);
    return cnc.unit();
}).then(res => {
    console.log(res);
    return cnc.home();
}).then(res => {
    console.log(res);
    return moveAndRead(10, 10, -10);
}).then(res => {
    console.log(res);
    return cnc.moveTo(20, 20, -10);
}).then(data => {
    console.log(data);
});

cnc.start();
sensor.start();

let moveDistance = 1.0;

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') process.exit();;

    if (key.name === 'left') cnc.move(-moveDistance, 0, 0);
    if (key.name === 'up')  cnc.move(0, moveDistance, 0);
    if (key.name === 'right') cnc.move(moveDistance, 0, 0);
    if (key.name === 'down') cnc.move(0, -moveDistance, 0);

    if (key.name === 'pageup') cnc.move(0, 0, moveDistance);
    if (key.name === 'pagedown') cnc.move(0, 0, -moveDistance);
});

process.stdin.setRawMode(true);
process.stdin.resume();