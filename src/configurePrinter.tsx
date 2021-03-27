/* eslint-disable no-eval */
import { message } from 'antd';
import dayjs from 'dayjs';
import qz from 'qz-tray';
import { EMPTY_CELL } from './global/constants';
import { getCashBreakdownTotal, getCashBreakdownTypeDescription, getProductQuantity, numberWithCommas } from './utils/function';

const PAPER_MARGIN = 0.2; // inches
const PAPER_WIDTH = 3.2; // inches
const PRINTER_MESSAGE_KEY = 'configurePrinter';
const SI_MESSAGE_KEY = 'SI_MESSAGE_KEY';
const PRINTER_NAME = 'EPSON TM-U220 Receipt';
// const PRINTER_NAME = 'Microsoft Print to PDF';

const configurePrinter = (callback = null) => {
	if (!qz.websocket.isActive()) {
		// Authentication setup
		qz.security.setCertificatePromise(function(resolve, reject) {
			resolve("-----BEGIN CERTIFICATE-----\n" + 
				"MIID0TCCArmgAwIBAgIUaDAsSKn5X23jaK5xvesh/G+dG9YwDQYJKoZIhvcNAQEL\n" + 
				"BQAwdzELMAkGA1UEBhMCUEgxDTALBgNVBAgMBENlYnUxDTALBgNVBAcMBENlYnUx\n" + 
				"DTALBgNVBAoMBEVKSlkxDTALBgNVBAsMBEVKSlkxDTALBgNVBAMMBEVKSlkxHTAb\n" + 
				"BgkqhkiG9w0BCQEWDmVqanlAZ21haWwuY29tMCAXDTIxMDMxODExNTYwMFoYDzIw\n" + 
				"NTIwOTEwMTE1NjAwWjB3MQswCQYDVQQGEwJQSDENMAsGA1UECAwEQ2VidTENMAsG\n" + 
				"A1UEBwwEQ2VidTENMAsGA1UECgwERUpKWTENMAsGA1UECwwERUpKWTENMAsGA1UE\n" + 
				"AwwERUpKWTEdMBsGCSqGSIb3DQEJARYOZWpqeUBnbWFpbC5jb20wggEiMA0GCSqG\n" + 
				"SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDl8JPChLBfKjHaKqw1rWxQKR/31aXikR+Z\n" + 
				"CUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+SYpbNPiNCp1+WkmZwDl3o\n" + 
				"RHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS9sD0nFzWlGjk6DkFvgEi\n" + 
				"kwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRAxJ1kdK5h53trtrve+HrA\n" + 
				"dAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t+sSePu9a41zxFQ7PXSjx\n" + 
				"cTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74jlfezw3I/AgMBAAGjUzBR\n" + 
				"MB0GA1UdDgQWBBQfsMynx4euCPD6No5re42teW/BezAfBgNVHSMEGDAWgBQfsMyn\n" + 
				"x4euCPD6No5re42teW/BezAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA\n" + 
				"A4IBAQBI1lCyFxWaeDUZcJJ49fbg0xzxGKzzsm99ur02e68tfwhK3uYSOhjLyzXJ\n" + 
				"V0Z/4h5oGKlwNHRS+dZkJCLQ6PM8iekFBhfj6bfiT6Q6aVytiaiyHicATLuFn0Xd\n" + 
				"LX8yJsqxnWoMvV4ne6jq+xROyY4QTKT/9Fn+dbzmrejvgBJ4dAHStdQlB+BRwa05\n" + 
				"/ay8LPTA9eh4uxwaW5W7rHyVXjliBa+TxNlQ+60z84BFqc2zO1/guBPbI+Y1nqs5\n" + 
				"rwwajZypAALkDgSCW7L837upVVZn4pH+eQkzVpb6EuftXs3CJv89cJiBux2wVDFD\n" + 
				"JwviDu5h2Z88yECPLNy9qRTDcHoa\n" + 
				"-----END CERTIFICATE-----");
		});
	
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		var privateKey = "-----BEGIN PRIVATE KEY-----\n" + 
			"MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDl8JPChLBfKjHa\n" + 
			"Kqw1rWxQKR/31aXikR+ZCUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+S\n" + 
			"YpbNPiNCp1+WkmZwDl3oRHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS\n" + 
			"9sD0nFzWlGjk6DkFvgEikwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRA\n" + 
			"xJ1kdK5h53trtrve+HrAdAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t\n" + 
			"+sSePu9a41zxFQ7PXSjxcTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74j\n" + 
			"lfezw3I/AgMBAAECggEBAMQysuGXNqb86eyt3KMwhusfLBfcRN891ShPs/xYwhZ4\n" + 
			"qWzyh7x2zAAhYh3jzRw/SKwq2VnH3ewAaPoPBX27N3r4NafU43NZzucQ//hyJBZt\n" + 
			"7ueZiGxgVHGcgHkZ9MFz3GJaPtLyk3V+bJQR2DLf+JdfquEnBQDRT0ahDqg+BJBh\n" + 
			"8kCwJ5G4LMoD04x2n4OF9F5iCueVjOVQFEZMiffYiHBRDGLqOeDZNgX94ZnM7Yrt\n" + 
			"Nl8RR0V1VCGM4L4Rx1Csc+x38+E2inwb4A/SvtIIZthd9nNIHkg9X5eayq2BL4a2\n" + 
			"gzRtPbPRG4XYAwlXzbVNm8NPxBO2fgcfJekjoU2LeAECgYEA+cGT1I/MXLmpN55o\n" + 
			"VNGTLs7hM+OrXqcJOnC+zNlpLZ2YixSqCcASE8SfdrRN02jg874dFdKInzsgSBl0\n" + 
			"RVNE8M030tLS9K8ZiWdOECxK4AFx7CkYDuKXIm6xlZbf5oNPKPDCUggPzbNfOr/W\n" + 
			"pdGz3yr4cHAUeBq4fpuVyFb0e/8CgYEA67AtEi0NdFiOElTGgRtzOGGrBnluSg9k\n" + 
			"1LFUCq58OsZjnBZXfwQ5SXf3i5Wlu/V++BVKKsk9b1b4zr2X7hWWUOq2pMrqpk5V\n" + 
			"bMRMrwDAvv5NHX48DwMiSAthfUxL0cTCa1hib3Km7ftpWsPtSbXR4RSTAtKYit5C\n" + 
			"CAuCccrqCcECgYEAxPmVxLPwgkTvH21wbUyoXudMl6b8Vfc5AP1AjcD+AbrkPvR6\n" + 
			"Mpxn5W1SMsV7B7wUhkevGrHjjGmOSS7CE5bbrWq8lyostEuQwVxXJcw49ThOh+nV\n" + 
			"DpBIkCBrMEZAqcVv3iMbrqSrChlohqYb/MVJrj1umQbcLektDrVYSRvDUDMCgYEA\n" + 
			"tDoFTSfcaQKqqYPgQ6v9ALlW8d17o/B/l1F+xahF4SAB3cML51oQgIjXaAroMIH7\n" + 
			"NLP7Ahre+rwUCOvcOTiSuI+zWPK+Wqv+EO1PAmfd/G80AwCb5pLr7RGe3BSyydbf\n" + 
			"IPz2UOjok4U0PC8kzb/WnXqBLKBj+5UYA1ThzChxrUECgYBHNWU+U73eI0t3eshF\n" + 
			"LRG73tlIcSHWVHOIQj7a4Eah+oHfWBAOXz8SrcPyCJOzPQuIn12y7fHMaBuBVdu2\n" + 
			"GVIghp5ztgXYWakpAxR1N1RFx04zFaAiBKFUesQYV8QpN+EkSOFORGnkPBIEJ4GS\n" + 
			"XxwqM7+VsuQCNx2WcHmO4bDN2A==\n" + 
			"-----END PRIVATE KEY-----";

		qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
		qz.security.setSignaturePromise(function(toSign) {
			return function(resolve, reject) {
				try {
					var pk = eval("KEYUTIL.getKey(privateKey);");
					var sig = eval('new KJUR.crypto.Signature({"alg": "SHA512withRSA"});');
					sig.init(pk); 
					sig.updateString(toSign);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					var hex = sig.sign();
					resolve(eval("stob64(hextorstr(hex))"));
				} catch (err) {
					console.error(err);
					reject(err);
				}
			};
		});

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
						<div style="width: 100%; text-align: center">${transaction?.invoice?.location || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">${transaction?.invoice?.proprietor || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">${transaction?.invoice?.tin || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">MIN</div>
						<div style="width: 100%; text-align: center">SN</div>
						<div style="width: 100%; text-align: center; font-weight: bold">[SALES INVOICE]</div>

						${
							isReprint
								? `<table style="width: 100%; font-size: 12px; line-height: 12px">
								<tr>
									<td>For 11/20/2020</td>
									<td style="text-align: right;">1:32PM REPRINT</td>
								</tr>
							</table>`
								: ''
						}

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							${transactionProducts.map((item) => (
									`<tr>
										<td colspan="2">${item.data.name}</td>
									</tr>
									<tr>
										<td style="padding-left: 30px">${getProductQuantity(item.quantity, item.data.unit_of_measurement)} @ ${`₱${item.pricePerPiece.toFixed(2)}`}</td>
										<td style="text-align: right">
											${`₱${(item.quantity * item.pricePerPiece).toFixed(2)}`} V
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
									₱${numberWithCommas(Number(transaction?.invoice?.vat_exempt).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>VAT Sales</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(transaction?.invoice?.vat_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>VAT Amount</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(transaction?.invoice?.vat_12_percent).toFixed(2))}
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
						<div style="width: 100%; text-align: center">${report?.location || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">${report?.proprietor || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">${report?.tin || EMPTY_CELL}</div>
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
								<td style="text-align: right">₱${numberWithCommas(Number(report?.discounts).toFixed(2))}</td>
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
								<td style="text-align: right">${report?.beginning_or?.or_number || EMPTY_CELL}</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">Ending OR #</td>
								<td style="text-align: right">${report?.ending_or?.or_number || EMPTY_CELL}</td>
							</tr>
							<tr>
								<td>Beg Sales</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.beginning_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>Cur Sales</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>End Sales</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.ending_sales).toFixed(2))}
								</td>
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
						<div style="width: 100%; text-align: center">${report?.location || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">Tel# 808-8866</div>
						<div style="width: 100%; text-align: center">${report?.proprietor || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">${report?.tin || EMPTY_CELL}</div>
						<div style="width: 100%; text-align: center">MIN</div>
						<div style="width: 100%; text-align: center">SN</div>
						<div style="width: 100%; text-align: center; font-weight: bold">[Z-REPORT]</div>	

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>CASH SALES</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.cash_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>CHEQUE SALES</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.check_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>CREDIT PAY</td>
								<td style="text-align: right; font-weight: bold">
									₱${numberWithCommas(Number(report?.credit_pay).toFixed(2))}
								</td>
							</tr>
						</table>

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td style="padding-left: 30px">DISCOUNTS</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.discounts).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td style="padding-left: 30px">SALES RETURNS</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.sales_return).toFixed(2))}
								</td>
							</tr>	
						</table>

						<hr />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>TOTAL SALES</td>
								<td style="text-align: right; font-weight: bold">
									₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}
								</td>
							</tr>
						</table>

						<br />

						<table style="width: 100%; font-size: 12px; line-height: 12px">
							<tr>
								<td>VAT Exempt</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.vat_exempt).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>VAT Sales</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.vat_sales).toFixed(2))}
								</td>
							</tr>
							<tr>
								<td>12% of VAT</td>
								<td style="text-align: right">
									₱${numberWithCommas(Number(report?.vat_12_percent).toFixed(2))}
								</td>
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
					<div style="width: 100%; font-family: courier new, tahoma; font-size: 12px; line-height: 12px">
						<div style="font-size: 20px; text-align: center; line-height: 20px">EJ AND JY</div>
						<div style="width: 100%; text-align: center">WET MARKET AND ENTERPRISES</div>
						<div style="width: 100%; text-align: center">POB., CARMEN, AGUSAN DEL NORTE</div>
						<div style="width: 100%; text-align: center">MAIN</div>

						<br />

						<div style="font-size: 20px; font-weight: bold; text-align: center; line-height: 20px">[CASH BREAKDOWN]</div>
						<div style="font-size: 20px; text-align: center; line-height: 20px">${getCashBreakdownTypeDescription(type)}</div>

						<br />

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
							<thead>
								<tr>
									<th>DENOM</th>
									<th>QTY</th>
									<th>AMOUNT</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><span>₱</span><span>0.25</span></td>
									<td style="text-align: right">${cashBreakdown.coins_25}</td>
									<td style="text-align: right">₱${0.25 * cashBreakdown.coins_25}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>0.50</span></td>
									<td style="text-align: right">${cashBreakdown.coins_50}</td>
									<td style="text-align: right">₱${0.50 * cashBreakdown.coins_50}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>1.00</span></td>
									<td style="text-align: right">${cashBreakdown.coins_1}</td>
									<td style="text-align: right">₱${1 * cashBreakdown.coins_1}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>5.00</span></td>
									<td style="text-align: right">${cashBreakdown.coins_5}</td>
									<td style="text-align: right">₱${5 * cashBreakdown.coins_5}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>10.00</span></td>
									<td style="text-align: right">${cashBreakdown.coins_10}</td>
									<td style="text-align: right">₱${10 * cashBreakdown.coins_10}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>20</span></td>
									<td style="text-align: right">${cashBreakdown.bills_20}</td>
									<td style="text-align: right">₱${20 * cashBreakdown.bills_20}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>50</span></td>
									<td style="text-align: right">${cashBreakdown.bills_50}</td>
									<td style="text-align: right">₱${50 * cashBreakdown.bills_50}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>100</span></td>
									<td style="text-align: right">${cashBreakdown.bills_100}</td>
									<td style="text-align: right">₱${100 * cashBreakdown.bills_100}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>200</span></td>
									<td style="text-align: right">${cashBreakdown.bills_200}</td>
									<td style="text-align: right">₱${200 * cashBreakdown.bills_200}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>500</span></td>
									<td style="text-align: right">${cashBreakdown.bills_500}</td>
									<td style="text-align: right">₱${500 * cashBreakdown.bills_500}</td>
								</tr>
								<tr>
									<td><span>₱</span><span>1000</span></td>
									<td style="text-align: right">${cashBreakdown.bills_1000}</td>
									<td style="text-align: right">₱${1000 * cashBreakdown.bills_1000}</td>
								</tr>
							</tbody>
						</table>

						<div style="display: flex; align-items: center; justify-content: space-evenly">
							<span>TOTAL</span>
							<span style="font-weight: bold;">₱${numberWithCommas(getCashBreakdownTotal(cashBreakdown).toFixed(2))}</span>
						</div>

						<br	/>

						<table style="width: 100%">
							<tr>
								<td>12/26/2020</td>
								<td>5:32PM</td>
								<td>N2M1</td>
							</tr>
							<tr>
								<td>John Doe</td>
								<td>—</td>
								<td></td>
							</tr>
						</table>

						<br/>

						<div style="text-align: center">EJ & JY I.T. SOLUTIONS</div>
						<div style="text-align: center">Burgos St., Poblacion, Carmen,</div>
						<div style="text-align: center">Agusan del Norte</div>
						<div style="text-align: center">178-846-963-005</div>
						<div style="text-align: center">ACCREDITATION NUMBER</div>
						<div style="text-align: center">DATE ISSUED</div>
						<div style="text-align: center">VALID UNTIL</div>
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
