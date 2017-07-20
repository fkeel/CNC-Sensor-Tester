import fs from 'fs.extra';
import path from 'path';
import EventEmitter from 'events';
import SerialPort from 'serialport';

const {Readline} = SerialPort.parsers;

class Sensor {
  constructor(com, filePath, options) {
    this.port = new SerialPort(com, options);
    this.filePath = path.resolve(__dirname, filePath);
    this.events = new EventEmitter();
    const parser = this.port.pipe(new Readline());
    parser.on('data', data => {
      this.events.emit('data', data);
    });
  }

  createLog() {
    return new Promise((resolve, reject) => {
      const input = path.resolve(__dirname, '../log.template');

      fs.copy(input, this.filePath, {replace: true}, err => {
        if (err) reject();
        resolve();
      });
    });
  }

  start() {
    const callback = (data) => {
      if (data === 'ok\r') {
        this.events.removeListener('data', callback);
        this.events.emit('ready');
      }
    };
    this.events.on('data', callback);
  }

  ready() {
    return new Promise(resolve => {
      this.events.on('ready', () => {
        this.createLog().then(() => {
          resolve();
        });
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      this.port.write('A');
      const callback = (data) => {
        data = data.trim();
        this.events.removeListener('data', callback);
        fs.appendFile(this.filePath, data + '\r\n', err => {
          if (err) reject(err);
          resolve(data.split(',').map(value => parseInt(value.trim())));
        });
      };
      this.events.on('data', callback);
    });
  }
}

export default Sensor;