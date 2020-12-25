import { message } from 'antd';

declare global {
	interface Window {
		epson: any;
	}
}

export default function configurePrinter() {
	return;
	const PRINTER_MESSAGE_KEY = 'configurePrinter';
	const epson = window.epson;
	const ipAddress = '192.168.192.168';
	const port = '8008';
	const ePosDev = new epson.ePOSDevice();
	let printer = null;

	const onCreateDevice = (deviceObj, errorCode) => {
		if (deviceObj === null) {
			// Displays an error message if the system fails to retrieve the Printer object
			message.error({
				content: 'Cannot retrieve printer.',
				key: PRINTER_MESSAGE_KEY,
			});
			return;
		}

		console.log('onCreateDevice: deviceObj', deviceObj);
		printer = deviceObj;

		// Registers the print complete event
		printer.onreceive = function (response) {
			console.log('onCreateDevice: onreceive: response', deviceObj);
			if (response.success) {
				message.success({
					content: 'Successfully registered the printer.',
					key: PRINTER_MESSAGE_KEY,
				});
				//Displays the successful print message
			} else {
				//Displays error messages
				message.error({
					content: 'Cannot register the printer.',
					key: PRINTER_MESSAGE_KEY,
				});
			}
		};
	};

	const onConnect = (resultConnect) => {
		console.log('onConnect: resultConnect', resultConnect);
		var deviceId = 'local_printer';
		var options = { crypto: false, buffer: false };

		if (resultConnect === 'OK' || resultConnect === 'SSL_CONNECT_OK') {
			// Retrieves the Printer object
			message.loading({
				content: 'Setting up printer...',
				key: PRINTER_MESSAGE_KEY,
				duration: 0,
			});
			ePosDev.createDevice(deviceId, ePosDev.DEVICE_TYPE_PRINTER, options, onCreateDevice);
		} else {
			message.error({
				content: 'Cannot initialize printer. Please make sure to connect the printer.',
				key: PRINTER_MESSAGE_KEY,
			});
		}
	};

	message.loading({
		content: 'Connecting to printer...',
		key: PRINTER_MESSAGE_KEY,
		duration: 0,
	});
	ePosDev.connect(ipAddress, port, onConnect);
}
