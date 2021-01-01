import { message } from 'antd';
import qz from 'qz-tray';

const PRINTER_MESSAGE_KEY = 'configurePrinter';
const PRINTER_NAME = 'EPSON TM-U220 Receipt';

const configurePrinter = (callback = null) => {
	if (!qz.websocket.isActive()) {
		message.loading({
			content: 'Connecting to printer...',
			key: PRINTER_MESSAGE_KEY,
			duration: 0,
		});

		qz.websocket
			.connect()
			.then(() => {
				message.success({
					content: 'Successfully detected printer: .',
					key: PRINTER_MESSAGE_KEY,
				});

				callback?.();
			})
			.catch((err) => {
				message.error({
					content: 'Cannot register the printer.',
					key: PRINTER_MESSAGE_KEY,
				});
				console.error(err);
				// process.exit(1);
			});
	}
};

export const printSalesInvoice = (transaction) => {
	configurePrinter(() => {
		qz.printers
			.find(PRINTER_NAME)
			.then((printer) => {
				const config = qz.configs.create(printer);
				const data = [
					{
						type: 'pixel',
						format: 'html',
						flavor: 'plain',
						data: '<h1>Hello World</h1>',
					},
				];
				return qz.print(config, data);
			})
			.then(() => {
				message.success('Successfully printed receipt.');
			})
			.catch((err) => {
				message.error(`Error occurred while trying to print receipt.`);
				console.error(err);
			});
	});
};

export default configurePrinter;
