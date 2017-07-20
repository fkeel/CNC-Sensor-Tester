const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

class CNC {
    constructor(com, options) {
        this.port = new SerialPort(com, options);
        this.events = new EventEmitter();
        const parser = this.port.pipe(new Readline());
        parser.on('data', data => {
            this.events.emit('data', data);
        });

        this.position = {'x': 0, 'y': 0, 'z': 0};
    }

    start() {
        let count = 0;
        const callback = (data) => {
            if (count === 2) {
                this.events.removeListener('data', callback);
                this.events.emit('ready');
            }
            count++;
        };
        this.events.on('data', callback);
    }

    ready() {
        return new Promise(resolve => {
            this.events.on('ready', resolve);
        })
    }

    command(name, message, num) {
        return new Promise(resolve => {
            let count = 0;
            this.port.write(message);

            const callback = (data) => {
                //console.log(name, count, data);
                if (count === num) {
                    this.events.removeListener('data', callback);
                    resolve(name + 'ed');
                }
                count++;
            };
            this.events.on('data', callback);
        })
    }

    unlock() {
        return this.command('unlock', '$X\n', 1);
    }

    unit() {
        return this.command('unit', 'G21\n', 0);
    }

    home() {
        return this.command('home', '$H\n', 0);
    }

    status() {
        return this.command('status', '?', 0);
    }

    move(x, y, z) {
        return new Promise(resolve => {
            let count = 0;
            this.port.write(`G91\nG0\nX${x}\nY${y}\nZ${z}\n`);
            const callback = (data) => {
                //console.log('move', count, data);
                if (count >= 4) {
                    if (data.slice(1, -1).split(',')[0].toLowerCase() !== 'idle') {
                        this.port.write('?');
                    } else {
                        this.events.removeListener('data', callback);
                        this.position.x = parseFloat(data.split(',')[1].slice(5, -1));
                        this.position.y = parseFloat(data.split(',')[2]);
                        this.position.z = parseFloat(data.split(',')[3]);

                        //console.log(this.position);
                        resolve('moveed');
                    }
                }
                count++;
            };
            this.events.on('data', callback);
        })
    }

    moveTo(x, y, z) {
        return this.move(x - this.position.x, y - this.position.y, z - this.position.z);
    }
}

export default CNC;