import { Divider, Modal } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../components';
import { Button } from '../../../components/elements';
import { printXreadReport } from '../../../configurePrinter';
import { EMPTY_CELL } from '../../../global/constants';
import { numberWithCommas } from '../../../utils/function';

interface Props {
	visible: boolean;
	report: any;
	onClose: any;
}

export const ViewXreadReportModal = ({ report, visible, onClose }: Props) => {
	const onPrint = () => {
		printXreadReport(report);
	};

	return (
		<Modal
			title={`XRead Report (${report?.total_sales === 0 ? 'Not Used' : 'Used'})`}
			visible={visible}
			footer={[<Button text="Print" variant="primary" onClick={onPrint} block />]}
			onCancel={onClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Location"
					value={report?.location || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Proprietor"
					value={report?.proprietor || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="TIN"
					value={report?.tin || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Permit No."
					value={report?.permit_number || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Machine ID"
					value={report?.branch_machine?.machine_id || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Serial No (of printer)"
					value={report?.branch_machine?.machine_printer_serial_number || EMPTY_CELL}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Cash Sales"
					value={`₱${numberWithCommas(Number(report?.cash_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Check Sales"
					value={`₱${numberWithCommas(Number(report?.check_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Credit Pay"
					value={`₱${numberWithCommas(Number(report?.credit_pay).toFixed(2))}`}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Sales Return"
					value={`₱${numberWithCommas(Number(report?.sales_return).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Total Sales"
					value={`₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}`}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="VAT Exempt"
					value={`₱${numberWithCommas(Number(report?.vat_exempt).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="VAT Sales"
					value={`₱${numberWithCommas(Number(report?.vat_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="12% of VAT"
					value={`₱${numberWithCommas(Number(report?.vat_12_percent).toFixed(2))}`}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Cashier"
					value={`${report?.generated_by?.first_name} ${report?.generated_by?.last_name}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Total Transactions"
					value={report?.total_transactions}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Beginning OR #"
					value={report?.beginning_or?.or_number || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Ending OR #"
					value={report?.ending_or?.or_number || EMPTY_CELL}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Beginning Sales"
					value={`₱${numberWithCommas(Number(report?.beginning_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Current Sales"
					value={`₱${numberWithCommas(Number(report?.total_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Ending Sales"
					value={`₱${numberWithCommas(Number(report?.ending_sales).toFixed(2))}`}
				/>

				<Divider dashed />

				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Software Developer"
					value={report?.software_developer || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="TIN"
					value={report?.software_developer_tin || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="POS Accreditation Number"
					value={report?.pos_accreditation_number || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={12}
					valueSpan={12}
					label="Accreditation Date"
					value={report?.pos_accreditation_date || EMPTY_CELL}
				/>
			</DetailsRow>
		</Modal>
	);
};
