import { message } from 'antd';
import moment from 'moment';
import qz from 'qz-tray';
import { EMPTY_CELL } from './global/constants';
import { numberWithCommas } from './utils/function';

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

export const printSalesInvoice = (transaction, change) => {
	const generated = transaction?.invoice?.datetime_created
		? moment(transaction?.invoice?.datetime_created).format('YYYY-MM-DD')
		: EMPTY_CELL;
	const cashier = `${transaction?.teller?.first_name} ${transaction?.teller?.last_name}`;

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
						data: `
							<spanstyle="text-align:center">EJ AND JY<span><br/>
							<spanstyle="text-align:center">WET AND MARKET ENTERPRISES<span><br/>
							<span>LOCATION         ${transaction?.invoice?.location}</span><br/>
							<span>PROPRIETOR       ${transaction?.invoice?.proprietor}</span><br/>
							<span>TIN              ${transaction?.invoice?.tin}</span><br/>
							<span>PERMIT NO.       ${transaction?.invoice?.permit_number}</span><br/>
							<span>MACHINE ID       ${transaction?.branch_machine?.machine_id}</span><br/>
							<span>SERIAL NO.       ${transaction?.branch_machine?.machine_printer_serial_number}</span><br/>
							<hr/>
							<span style="text-align:center">OFFICIAL RECEIPT</span>
							<hr/>
							PRODUCT LIST HERE...
							<hr/>
							<span>SUBTOTAL                    ₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}</span><br/>
							<span>      AMOUNT RECEIVED       ₱${numberWithCommas(Number(transaction?.total_paid_amount).toFixed(2))}</span><br/>
							<span>      AMOUNT DUE            ₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}</span><br/>
							<span>      CHANGE                ₱${change.toFixed(2)}</span><br/>
							<span>VAT EXEMPT                  ₱${numberWithCommas(Number(transaction?.invoice?.vat_exempt).toFixed(2))}</span><br/>
							<span>VAT SALES                   ₱${numberWithCommas(Number(transaction?.invoice?.vat_sales).toFixed(2))}</span><br/>
							<span>12% OF VAT                  ₱${numberWithCommas(Number(transaction?.invoice?.vat_12_percent).toFixed(2))}</span><br/>
							<hr/>
							<span>GENERATED             ${generated}</span><br/>
							<span>CASHIER               ${cashier}</span><br/>
							<span>TOTAL TRANSACTIONS    ${transaction?.invoice?.total_transactions}</span><br/>
							<br/>
							<span>NAME:                 ${EMPTY_CELL}</span><br/>
							<span>TIN:                  ${EMPTY_CELL}</span><br/>
							<span>ADDRESS:              ${EMPTY_CELL}</span><br/>
							<br/>
							<spanstyle="text-align:center">${transaction?.invoice?.software_developer}<span><br/>
							<spanstyle="text-align:center">${transaction?.invoice?.software_developer_tin}<span><br/>
							<spanstyle="text-align:center">${transaction?.invoice?.pos_accreditation_number}<span><br/>
							<spanstyle="text-align:center">${transaction?.invoice?.pos_accreditation_date}<span><br/>
						`,
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
