import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle, TableNormal } from '../../../../components';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

const columns = [
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', center: true },
	{ name: 'Rate', center: true },
	{ name: 'Amount', center: true },
];

export const InvoiceModal = ({ visible, onClose }: Props) => {
	const {
		transactionId,
		transactionProducts,
		orNumber,
		resetTransaction,
	} = useCurrentTransaction();

	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = transactionProducts.map((item) => [
			item.productName,
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
					classNamesLabel="invoice-label"
					classNamesValue="invoice-value"
					label="Invoice No."
					value={orNumber}
				/>
				<DetailsSingle
					classNamesLabel="invoice-label"
					classNamesValue="invoice-value"
					label="Transaction No."
					value={transactionId}
				/>
			</DetailsRow>

			<TableNormal columns={columns} data={data} />
		</Modal>
	);
};
