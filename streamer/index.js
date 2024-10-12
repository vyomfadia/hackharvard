const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const {WebSocketServer} = require("ws");

// Create a port
const port = new SerialPort({
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

const history = []
const vals = []

// Switches the port into "flowing mode"
const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}))
parser.on('data', (data) => {
	history.push(Number(data))
	const val = history.reduce((acc, c) => acc + c, 0) / history.length
	vals.push(val)
	if (coreWs && vals.length >= 5) {
		coreWs.send(vals[vals.length-1]);
		vals.filter((_) => false);
	}

	console.log(val);
	if (history.length > 20) {
		history.shift()
	}
})
