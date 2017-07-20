'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
	function Controller(moves, cncPort, sensorPort) {
		_classCallCheck(this, Controller);

		this.index = 0;
		this.running = false;
		this.ready = false;

		this.moves = moves;
		this.cncPort = cncPort;
		this.sensorPort = sensorPort;

		this.start();
	}

	_createClass(Controller, [{
		key: 'move',
		value: function move(x, y, z) {
			console.log(x, y, z);
		}
	}, {
		key: 'start',
		value: function start() {
			var _this = this;

			this.running = true;

			this.cncPort.on('data', function (data) {
				console.log(data);
			});

			this.sensorPort.on('data', function (data) {
				_this.ready = true; //condition
			});

			this.loop();
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.running = false;
		}
	}, {
		key: 'loop',
		value: function loop() {
			if (this.running) {
				cncPort.write('?');

				if (this.ready) {}

				console.log("hey");

				// read vale from cnc
				// when ready

				// if (this.condition()) { // true is placeholder for condition
				// 	if (this.index < this.moves.length) {
				// 		this.move(...this.moves[this.index++]);
				// 	} else {
				// 		this.stop();
				// 	}
				// }


				// condtion som bliver true f'r var den false

				// let prevConditionResult = '';

				// if(conditionResult && !prevConditionResult) {

				// }

				// prevConditionResult = conditionResult;
			}
		}
	}]);

	return Controller;
}();

exports.default = Controller;