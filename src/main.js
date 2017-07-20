import keypress from 'keypress';
import CNC from './CNC';
import Sensor from './Sensor';
import IterablePromise from './IterablePromise';

const cnc = new CNC('COM4', {baudRate: 115200});
const sensor = new Sensor('COM1', '../test.csv', {baudRate: 9600});

function moveToAndRead(x, y, z, maxDepth) {
  return new Promise(resolve => {
    let read = null;
    cnc.moveTo(x, y, z).then(() => {
      return sensor.read();
    }).then((data) => {
      read = data;
      return cnc.moveTo(x, y, maxDepth);
    }).then(() => {
      resolve(read);
    });
  });
}

const moves = IterablePromise.createMultiple(moveToAndRead, [
  [10, 10, -70],
  [20, 20, -70],
  [30, 30, -70],
], [-65]);

Promise.all([
  cnc.ready(),
  sensor.ready(),
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
  return IterablePromise.iterate(moves);
}).then(data => {
  console.log(data);
});

cnc.start();
sensor.start();

let moveDistance = 1.0;

keypress(process.stdin);
process.stdin.on('keypress', function(ch, key) {
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