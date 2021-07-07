import { message } from 'antd';
import dayjs from 'dayjs';
import qz from 'qz-tray';
import { EMPTY_CELL } from './global/constants';
import { getCashBreakdownTypeDescription, getProductQuantity, numberWithCommas } from './utils/function';

const PAPER_MARGIN = 0.2; // inches
const PAPER_WIDTH = 3.2; // inches
const PRINTER_MESSAGE_KEY = 'configurePrinter';
const SI_MESSAGE_KEY = 'SI_MESSAGE_KEY';
const PRINTER_NAME = 'EPSON TM-U220 Receipt';
// const PRINTER_NAME = 'Microsoft Print to PDF';

const configurePrinter = (callback = null) => {
	if (!qz.websocket.isActive()) {
		// Authentication setup
		qz.security.setCertificatePromise(function (resolve, reject) {
			//Alternate method 2 - direct
			resolve("-----BEGIN CERTIFICATE-----\n" + 
				"MIIC2DCCAcACCQDbsDMxRWeypzANBgkqhkiG9w0BAQsFADAtMQ0wCwYDVQQKDARF\n" + 
				"SkpZMQ0wCwYDVQQLDARFSkpZMQ0wCwYDVQQDDARFSkpZMCAXDTIxMDIxODA3MzEx\n" + 
				"MFoYDzIwNTIwODEzMDczMTEwWjAtMQ0wCwYDVQQKDARFSkpZMQ0wCwYDVQQLDARF\n" + 
				"SkpZMQ0wCwYDVQQDDARFSkpZMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\n" + 
				"AQEAx1weEomPtIi4ETBWqcSjzolUQVtsOz1mp8K91tVSImZslXG7t0mplVarc4pN\n" + 
				"w7o1hD4hmn7rag3JhLOJrkkZ04WQUzKpRrkUnuVf26hxjqoKjSP3gUk22j3xuYMR\n" + 
				"DfBN9Qvy7qs9XqR9JT7KCce3bgxZpUdoOfK2N6scZjCkNsH1zqM1so/aDEkAF2He\n" + 
				"2BpMg9xorWbmDA0Qe2HF3fslCbTyzAa9qq7y3Rw/yDhaQ7F0l/7D4hBRg/3WGrjv\n" + 
				"wUcm7OLaC8hAcP8V/Y1is2+M8TxQZ5BMZR95CSw3qyGN++Mw2lvOKBE/cKmTs64x\n" + 
				"oMn6wE66EGsJJkxGOaZy3Aq+jwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCRRS9H\n" + 
				"M1g+nOarunY+MrnjBwtnUFdCZKJDzetgPwDfTTIuY7k0mx4Mm0aNjyfz2OKcnJoi\n" + 
				"GcnqjzPjbv3I2+3sbc4muItLkV5PyRP8SVUcjUWD/ql30DXLpAmmxD2JvVtu0xv5\n" + 
				"+CMF/mrkGmU7/Oos4D7AS5lHx4P/73JCcyeVOwIj4JKzCrZPJ/ot4ECdtQRUKHP6\n" + 
				"JU34uiv9UeGP5hwPh6/an9YkmBQNtLNBOYgBg33OCkYEsosJxIeYHgZ/hP01beOr\n" + 
				"vVdcs+Swa/Q6nLkclLl53/r3sX3ypKzORuLo+F7I/Z8zbtm1c6jfmyCn5qNNygVe\n" + 
				"jl3kpz8ugDyp9FyV\n" + 
				"-----END CERTIFICATE-----");
		});
		
	  	qz.security.setSignatureAlgorithm('SHA512'); // Since 2.1

		message.loading({
			content: 'Connecting to printer...',
			key: PRINTER_MESSAGE_KEY,
			duration: 0,
		});

		qz.websocket
			.connect()
			.then(() => {
				message.success({
					content: 'Successfully connected to printer: .',
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
			});
	}
};

export const printSalesInvoice = (transaction, transactionProducts, change, isReprint = false) => {
	message.loading({
		content: 'Printing sales invoice...',
		key: SI_MESSAGE_KEY,
		duration: 0,
	});

	const generated = transaction?.invoice?.datetime_created
		? dayjs(transaction?.invoice?.datetime_created)
		: dayjs();
		const endValidityDate = generated.add(5, 'year');
	const cashier = `${transaction?.teller?.first_name} ${transaction?.teller?.last_name}`;

	qz.printers
		.find(PRINTER_NAME)
		.then((printer) => {
			message.success(`Printer found: ${printer}`);
			const config = qz.configs.create(printer, { margins: { top: 0, right: PAPER_MARGIN, bottom: 0, left: PAPER_MARGIN }});
			const data = [
				{
					type: 'pixel',
					format: 'html',
					flavor: 'plain',
					options: { pageWidth: PAPER_WIDTH },
					data: `
					<div style="width: 100%; font-family: courier new, tahoma; font-size: 12px; line-height: 12px">
						<div style="font-size: 20px; text-align: center; line-height: 20px">EJ AND JY</div>
						<div style="width: 100%; text-align: center">WET MARKET AND ENTERPRISES</div>
						<div style="width: 100%; text-align: center">POB., CARMEN, AGUSAN DEL NORTE</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">EMMANUEL T. FINEZA</div>
						<div style="width: 100%; text-align: center">178-846-963-000</div>
						<div style="width: 100%; text-align: center">MIN</div>
						<div style="width: 100%; text-align: center">SN</div>
						<div style="width: 100%; text-align: center; font-weight: bold">[SALES INVOICE]</div>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							${transactionProducts.map((item) => (
									`<tr>
										<td colspan="2">${item.product.name}</td>
									</tr>
									<tr>
										<td style="padding-left: 30px">${getProductQuantity(item.quantity, item.product.unit_of_measurement)} @ ${`₱${item.price_per_piece.toFixed(2)}`}</td>
										<td style="text-align: right">
											${`₱${(item.quantity * item.price_per_piece).toFixed(2)}`} V
										</td>
									</tr>`
								)).join('')	
							}
						</table>

						<div style="width: 100%; font-weight: bold">----------------</div>

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>TOTAL AMOUNT</td>
								<td style="text-align: right; font-size: 14px; font-weight: bold">
									₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}
								</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">AMOUNT RECEIVED</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(transaction?.total_paid_amount + (change || 0)).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">AMOUNT DUE</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">CHANGE</td>
								<td style="text-align: right; font-size: 14px; font-weight: bold">
									₱${change?.toFixed(2)}
								</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>VAT Exempt</td>
								<td style="text-align: right">
									₱0.00
								</td>
							</tr>
							<tr>
								<td>VAT Sales</td>
								<td style="text-align: right">
									₱196.43
								</td>
							</tr>
							<tr>
								<td>VAT Amount</td>
								<td style="text-align: right">
									₱23.57
								</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>${generated.format('MM/DD/YYYY')}</td>
								<td>${generated.format('HH:mm A')}</td>
								<td>${cashier}</td>
							</tr>
							<tr>
								<td>${transaction?.invoice?.or_number}</td>
								<td>N2M1</td>
								<td>${transactionProducts?.length} item(s)</td>
							</tr>
						</table>

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>NAME:</td>
								<td>${EMPTY_CELL}</td>
							</tr>
							<tr>
								<td>TIN:</td>
								<td>${EMPTY_CELL}</td>
							</tr>
							<tr>
								<td>ADDRESS:</td>
								<td>${EMPTY_CELL}</td>
							</tr>
						</table>

						<br />

						<div style="text-align: center">EJ & JY I.T. SOLUTIONS</div>
						<div style="text-align: center">Burgos St., Poblacion, Carmen,</div>
						<div style="text-align: center">Agusan del Norte</div>
						<div style="text-align: center">178-846-963-005</div>
						<div style="text-align: center">ACCREDITATION NUMBER</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>

						<br />

						<div style="text-align: center">PTU#</div>
						<div style="text-align: center">${generated.format('MM/DD/YYYY')}</div>
						<div style="text-align: center">${endValidityDate.format('MM/DD/YYYY')}</div>
						<div style="text-align: center">PRODUCT VERSION</div>
						<div style="text-align: center">THIS RECEIPT SHALL BE VALID FOR FIVE (5) YEARS FROM THE DATE OF PERMIT TO USE.</div>
						<div style="text-align: center">THIS SERVES AS YOUR SALES INVOICE</div>
						<div style="text-align: center">"Thank You! Come Again!"</div>
					</div>
					`,
				},
			];

			return qz.print(config, data);
		})
		.then(() => {
			message.success({
				content: 'Successfully printed receipt.',
				key: SI_MESSAGE_KEY,
			});
		})
		.catch((err) => {
			message.error({
				content: 'Error occurred while trying to print receipt.',
				key: SI_MESSAGE_KEY,
			});
			console.error(err);
		});
};

export const printXreadReport = (report) => {
	message.loading({
		content: 'Printing xread report...',
		key: SI_MESSAGE_KEY,
		duration: 0,
	});

	qz.printers
		.find(PRINTER_NAME)
		.then((printer) => {
			message.success(`Printer found: ${printer}`);
			const config = qz.configs.create(printer, { margins: { top: 0, right: PAPER_MARGIN, bottom: 0, left: PAPER_MARGIN }});
			const data = [
				{
					type: 'pixel',
					format: 'html',
					flavor: 'plain',
					options: { pageWidth: PAPER_WIDTH },
					data: `
					<div style="width: 100%; font-family: courier new, tahoma; font-size: 12px; line-height: 12px">
						<div style="font-size: 20px; text-align: center; line-height: 20px">EJ AND JY</div>
						<div style="width: 100%; text-align: center">WET MARKET AND ENTERPRISES</div>
						<div style="width: 100%; text-align: center">POB., CARMEN, AGUSAN DEL NORTE</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">EMMANUEL T. FINEZA</div>
						<div style="width: 100%; text-align: center">178-846-963-000</div>
						<div style="width: 100%; text-align: center">MIN</div>
						<div style="width: 100%; text-align: center">SN</div>
						<div style="width: 100%; text-align: center; font-weight: bold">[X-REPORT]</div>	

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>CASH SALES</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.cash_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>CHEQUE SALES</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.check_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>CREDIT PAY</td>
								<td style="text-align: right;">₱${numberWithCommas(Number(report?.credit_pay).toFixed(2))}</td>
							</tr>
							<tr>
								<td>TOTAL SALES</td>
								<td style="text-align: right; font-weight: bold">₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}</td>
							</tr>
						</table>

						<br/> 

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">DISCOUNTS</td>
								<td style="text-align: right">₱0.00</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">SALES RETURNS</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.sales_return).toFixed(2))}</td>
							</tr>	
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>VAT Exempt</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_exempt).toFixed(2))}</td>
							</tr>
							<tr>
								<td>VAT Sales</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>VAT Amount</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_12_percent).toFixed(2))}</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>FOR	DEC-07-2020</td>
								<td>N2M1</td>
								<td>${report?.total_transactions} tran(s)</td>
							</tr>
							<tr>
								<td>12/26/2020</td>
								<td>5:32PM</td>
								<td>${report?.generated_by?.first_name} ${report?.generated_by?.last_name}</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">Beginning OR #</td>
								<td style="text-align: right">20210206-1</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">Ending OR #</td>
								<td style="text-align: right">${report?.ending_or?.or_number || EMPTY_CELL}</td>
							</tr>
							<tr>
								<td>Beg Sales</td>
								<td style="text-align: right">₱1,000.00</td>
							</tr>
							<tr>
								<td>Cur Sales</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>End Sales</td>
								<td style="text-align: right">₱3,840.00</td>
							</tr>
						</table>

						<br />

						<div style="text-align: center">EJ & JY I.T. SOLUTIONS</div>
						<div style="text-align: center">Burgos St., Poblacion, Carmen,</div>
						<div style="text-align: center">Agusan del Norte</div>
						<div style="text-align: center">178-846-963-005</div>
						<div style="text-align: center">ACCREDITATION NUMBER</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>

						<br />

						<div style="text-align: center">PTU#</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>
						<div style="text-align: center">PRODUCT VERSION</div>
					</div>
					`,
				},
			];

			return qz.print(config, data);
		})
		.then(() => {
			message.success({
				content: 'Successfully printed xread report.',
				key: SI_MESSAGE_KEY,
			});
		})
		.catch((err) => {
			message.error({
				content: 'Error occurred while trying to print xread report.',
				key: SI_MESSAGE_KEY,
			});
			console.error(err);
		});
};

export const printZreadReport = (report) => {
	message.loading({
		content: 'Printing zread report...',
		key: SI_MESSAGE_KEY,
		duration: 0,
	});

	qz.printers
		.find(PRINTER_NAME)
		.then((printer) => {
			message.success(`Printer found: ${printer}`);
			const config = qz.configs.create(printer, { margins: { top: 0, right: PAPER_MARGIN, bottom: 0, left: PAPER_MARGIN }});
			const data = [
				{
					type: 'pixel',
					format: 'html',
					flavor: 'plain',
					options: { pageWidth: PAPER_WIDTH },
					data: `
					<div style="width: 100%; font-family: courier new, tahoma; font-size: 12px; line-height: 12px">
						<div style="font-size: 20px; text-align: center; line-height: 20px">EJ AND JY</div>
						<div style="width: 100%; text-align: center">WET MARKET AND ENTERPRISES</div>
						<div style="width: 100%; text-align: center">POB., CARMEN, AGUSAN DEL NORTE</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">EMMANUEL T. FINEZA</div>
						<div style="width: 100%; text-align: center">178-846-963-000</div>
						<div style="width: 100%; text-align: center">MIN</div>
						<div style="width: 100%; text-align: center">SN</div>
						<div style="width: 100%; text-align: center; font-weight: bold">[Z-REPORT]</div>	

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>CASH SALES</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.cash_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>CHEQUE SALES</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.check_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>CREDIT PAY</td>
								<td style="text-align: right; font-weight: bold">₱${numberWithCommas(Number(report?.credit_pay).toFixed(2))}</td>
							</tr>
						</table>

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">DISCOUNTS</td>
								<td style="text-align: right">₱0.00</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">SALES RETURNS</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.sales_return).toFixed(2))}</td>
							</tr>	
						</table>

						<hr />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>TOTAL SALES</td>
								<td style="text-align: right; font-weight: bold">₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>VAT Exempt</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_exempt).toFixed(2))}</td>
							</tr>
							<tr>
								<td>VAT Sales</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_sales).toFixed(2))}</td>
							</tr>
							<tr>
								<td>12% of VAT</td>
								<td style="text-align: right">₱${numberWithCommas(Number(report?.vat_12_percent).toFixed(2))}</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>FOR	DEC-07-2020</td>
								<td>N2M1</td>
								<td></td>
							</tr>
							<tr>
								<td>12/26/2020</td>
								<td>5:32PM</td>
								<td>${report?.generated_by?.first_name} ${report?.generated_by?.last_name}</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">Ending OR #</td>
								<td style="text-align: right">${report?.ending_or?.or_number || EMPTY_CELL}</td>
							</tr>
						</table>

						<br />

						<div style="text-align: center">EJ & JY I.T. SOLUTIONS</div>
						<div style="text-align: center">Burgos St., Poblacion, Carmen,</div>
						<div style="text-align: center">Agusan del Norte</div>
						<div style="text-align: center">178-846-963-005</div>
						<div style="text-align: center">ACCREDITATION NUMBER</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>

						<br />

						<div style="text-align: center">PTU#</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>
						<div style="text-align: center">PRODUCT VERSION</div>
					</div>
					`,
				},
			];

			return qz.print(config, data);
		})
		.then(() => {
			message.success({
				content: 'Successfully printed zread report.',
				key: SI_MESSAGE_KEY,
			});
		})
		.catch((err) => {
			message.error({
				content: 'Error occurred while trying to print zread report.',
				key: SI_MESSAGE_KEY,
			});
			console.error(err);
		});
};

export const printCashBreakdown = (cashBreakdown, session, type) => {
	message.loading({
		content: 'Printing cash breakdown...',
		key: SI_MESSAGE_KEY,
		duration: 0,
	});

	qz.printers
		.find(PRINTER_NAME)
		.then((printer) => {
			message.success(`Printer found: ${printer}`);
			const config = qz.configs.create(printer, { margins: { top: 0, right: PAPER_MARGIN, bottom: 0, left: PAPER_MARGIN }});
			const data = [
				{
					type: 'pixel',
					format: 'html',
					flavor: 'plain',
					options: { pageWidth: PAPER_WIDTH },
					data: `
					<div style="width: 100%; font-family: tahoma, helvetica, verdana; font-size: 12px; line-height: 12px">
						<div style="font-size: 20px; text-align: center; line-height: 20px">EJ AND JY</div>
						<div style="width: 100%; text-align: center">WET MARKET AND ENTERPRISES</div>

						<hr />

						<div style="font-size: 20px; text-align: center; line-height: 20px">${getCashBreakdownTypeDescription(type)}</div>

						<hr />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>Branch & Location:</td>
								<td style="text-align: right">${session?.user?.branch?.name} - ${session?.user?.branch?.location}</td>
							</tr>
							<tr>
								<td>Machine Name:</td>
								<td style="text-align: right">${session?.branch_machine?.name}</td>
							</tr>
							<tr>
								<td>Datetime Created:</td>
								<td style="text-align: right">${dayjs().format('MM/DD/YYYY h:mmA')}</td>
							</tr>
							<tr>
								<td>Generated By:</td>
								<td style="text-align: right">${session?.user?.first_name} ${session?.user?.last_name}</td>
							</tr>
						</table>

						<hr />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>₱0.25</td>
								<td style="text-align: right">${cashBreakdown.coins_25}</td>
							</tr>
							<tr>
								<td>₱0.50</td>
								<td style="text-align: right">${cashBreakdown.coins_50}</td>
							</tr>
							<tr>
								<td>₱1.00</td>
								<td style="text-align: right">${cashBreakdown.coins_1}</td>
							</tr>
							<tr>
								<td>₱5.00</td>
								<td style="text-align: right">${cashBreakdown.coins_5}</td>
							</tr>
							<tr>
								<td>₱10.00</td>
								<td style="text-align: right">${cashBreakdown.coins_10}</td>
							</tr>
							<tr>
								<td>₱20</td>
								<td style="text-align: right">${cashBreakdown.bills_20}</td>
							</tr>
							<tr>
								<td>₱50</td>
								<td style="text-align: right">${cashBreakdown.bills_50}</td>
							</tr>
							<tr>
								<td>₱100</td>
								<td style="text-align: right">${cashBreakdown.bills_100}</td>
							</tr>
							<tr>
								<td>₱200</td>
								<td style="text-align: right">${cashBreakdown.bills_200}</td>
							</tr>
							<tr>
								<td>₱500</td>
								<td style="text-align: right">${cashBreakdown.bills_500}</td>
							</tr>
							<tr>
								<td>₱1000</td>
								<td style="text-align: right">${cashBreakdown.bills_1000}</td>
							</tr>
						</table>
					</div>
					`,
				},
			];

			return qz.print(config, data);
		})
		.then(() => {
			message.success({
				content: 'Successfully printed cash breakdown.',
				key: SI_MESSAGE_KEY,
			});
		})
		.catch((err) => {
			message.error({
				content: 'Error occurred while trying to print cash breakdown.',
				key: SI_MESSAGE_KEY,
			});
			console.error(err);
		});
};

export default configurePrinter;
