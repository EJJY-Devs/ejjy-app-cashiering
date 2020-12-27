import { message } from 'antd';

declare global {
	interface Window {
		epson: any;
	}
}

export var printer = null;
export var ePosDev = null;

const configurePrinter = () => {
	const PRINTER_MESSAGE_KEY = 'configurePrinter';
	const epson = window.epson;
	const ipAddress = '192.168.192.168';
	const port = '8008';
	const ePosDevObj = new epson.ePOSDevice();

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
			//Displays the successful print message
			console.log('onCreateDevice: onreceive: response', deviceObj);
			if (response.success) {
				message.success({
					content: 'Successfully registered the printer.',
					key: PRINTER_MESSAGE_KEY,
				});
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
			ePosDevObj.createDevice(deviceId, ePosDevObj.DEVICE_TYPE_PRINTER, options, onCreateDevice);
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

	ePosDevObj.connect(ipAddress, port, onConnect);
	ePosDev = ePosDevObj;
};

export const printSalesInvoice = (transaction) => {
	printer.addTextAlign(printer.ALIGN_CENTER);
	printer.addText('EJ AND JY\n');
	printer.addText('WET MARKET AND ENTERPRISES\n');

	printer.send(({ success, code }) => {
		if (success) {
			message.success('Successfully printed.');
		} else {
			message.success(`Error occurred while trying to print receipt: ${code}`);
		}
	});
};

export default configurePrinter;
