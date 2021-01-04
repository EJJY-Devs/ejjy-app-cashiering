import { Divider, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle, Table } from '../../../../components';
import Button from '../../../../components/elements/Button/Button';
import { EMPTY_CELL } from '../../../../global/constants';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	visible: boolean;
	transaction: any;
	onClose: any;
}

const columns = [
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', center: true },
	{ name: 'Rate', center: true },
	{ name: 'Amount', center: true },
];

export const InvoiceModal = ({ visible, transaction, onClose }: Props) => {
	// CUSTOM HOOKS
	const { transactionProducts, resetTransaction } = useCurrentTransaction();
	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = transactionProducts.map((item) => [
			item.data.name,
			item.quantity.toFixed(3),
			`₱${item.pricePerPiece.toFixed(2)}`,
			`₱${(item.quantity * item.pricePerPiece).toFixed(2)}`,
		]);

		setData(formattedProducts);
	}, [transactionProducts]);

	const close = () => {
		resetTransaction();
		onClose();
	};

	return (
		<Modal
			title="Invoice"
			className="InvoiceModal modal-large"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Location"
					value={transaction?.invoice?.location || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Proprietor"
					value={transaction?.invoice?.proprietor || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="TIN"
					value={transaction?.invoice?.tin || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Permit No."
					value={transaction?.invoice?.permit_number || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Machine ID"
					value={transaction?.branch_machine?.machine_id || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Serial No (of printer)"
					value={transaction?.branch_machine?.machine_printer_serial_number || EMPTY_CELL}
				/>
			</DetailsRow>

			<Divider />

			<h4 className="official-receipt-label">OFFICIAL RECEIPT</h4>

			<Divider />

			<Table columns={columns} data={data} />

			<Divider />

			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Subtotal"
					value={`₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}`}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Amount Received"
					value={`₱${numberWithCommas(Number(transaction?.total_paid_amount).toFixed(2))}`}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Amount Due"
					value={`₱${numberWithCommas(Number(transaction?.total_amount).toFixed(2))}`}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="VAT Exempt"
					value={`₱${numberWithCommas(Number(transaction?.invoice?.vat_exempt).toFixed(2))}`}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="VAT Sales"
					value={`₱${numberWithCommas(Number(transaction?.invoice?.vat_sales).toFixed(2))}`}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="12% VAT"
					value={`₱${numberWithCommas(Number(transaction?.invoice?.vat_12_percent).toFixed(2))}`}
				/>
			</DetailsRow>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Generated"
					value={
						transaction?.invoice?.datetime_created
							? dayjs(transaction?.invoice?.datetime_created).format('YYYY-MM-DD')
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Cashier"
					value={
						`${transaction?.teller?.first_name} ${transaction?.teller?.last_name}` || EMPTY_CELL
					}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Total Transactions"
					value={transaction?.invoice?.total_transactions || EMPTY_CELL}
				/>
			</DetailsRow>

			<br />

			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Name"
					value={EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="TIN"
					value={EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={8}
					valueSpan={16}
					label="Address"
					value={EMPTY_CELL}
				/>
			</DetailsRow>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					classNamesValue="value value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer_tin || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_number || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_date || EMPTY_CELL}
				/>
			</DetailsRow>

			<Divider />

			<div className="custom-footer">
				<Button classNames="btn-cancel" text="Close" size="lg" onClick={close} />
			</div>
		</Modal>
	);
};
