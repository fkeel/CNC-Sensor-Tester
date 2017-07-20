const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

class Sensor {
    constructor(com, options) {
        this.port = new SerialPort(com, options);
        this.events = new EventEmitter();
        const parser = this.port.pipe(new Readline());
        parser.on('data', data => {
            this.events.emit('data', data);
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
            this.events.on('ready', resolve);
        })
    }

    read() {
        return new Promise(resolve => {
            this.port.write('A');
            const callback = (data) => {
                this.events.removeListener('data', callback);
                resolve(data);
            };
            this.events.on('data', callback);
        })
    }
}


export default Sensor;