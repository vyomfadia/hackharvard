const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const {WebSocketServer} = require("ws");

// Create a port
const port = new SerialPort({
	path: '/dev/cu.usbmodem1101',
	baudRate: 9600,
	autoOpen: false,
})

// Create a port
const port2 = new SerialPort({
	path: '/dev/cu.usbmodem101',
	baudRate: 9600,
	autoOpen: false,
})

const wss = new WebSocketServer({port: 8087});
let coreWs = null;

wss.on('connection', function connection(ws) {
	coreWs = ws;
});

port.open(function (err) {
	if (err) {
		return console.log('Error opening port: ', err.message)
	}
})

port2.open(function (err) {
	if (err) {
		return console.log('Error opening port2: ', err.message)
	}
})

const history = [];
let count = 0;

// Switches the port into "flowing mode"
const parser = port.pipe(new ReadlineParser({delimiter: '\n'}))
parser.on('data', (data) => {
	console.log(data);
	history.push(JSON.parse(data))

	let avg = history[0];
	for (let i = 1; i < history.length; i++) {
		for (const key in history[i]) {
			avg[key] += history[i][key];
		}
	}

	for (const key in avg) {
		avg[key] /= history.length;
	}

	count++;
	if (count > 20) {
		count = 0;

		const heelAngle = Math.max(Math.min(30, (avg["heel"] - 1.5) * 10), 0);
		const leftAngle = Math.max(Math.min(30, (avg["left"] - 1.5) * 10), 5);
		const rightAngle = Math.max(Math.min(180, (avg["right"] - 1.5) * 10 + 130), 165);

		port2.write(`heel ${heelAngle.toFixed(2)}\n`, (err) => {
			if (err) {
				return console.log('Error on write: ', err.message)
			}
		});

		port2.write(`left ${leftAngle.toFixed(2)}\n`, (err) => {
			if (err) {
				return console.log('Error on write: ', err.message)
			}
		});

		port2.write(`right ${rightAngle.toFixed(2)}\n`, (err) => {
			if (err) {
				return console.log('Error on write: ', err.message)
			}
		});
	}

	if (coreWs) {
		coreWs.send(JSON.stringify(avg));
	}

	if (history.length > 20) {
		history.shift()
	}
})

const parser2 = port2.pipe(new ReadlineParser({delimiter: '\n'}))
parser2.on('data', (data) => {
	console.log(data);
})
