/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { CancelButtonIcon, TableNormal } from '../../../../../components';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', center: true },
	{ name: 'Rate', center: true },
	{ name: 'Amount', center: true },
];

export const ProductTable = () => {
	const { products, removeProduct } = useCurrentTransaction();

	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = products.map((item) => [
			<CancelButtonIcon tooltip="Remove" onClick={() => removeProduct({ id: item.id })} />,
			item.productName,
			item.quantity.toFixed(3),
			`₱${item.pricePerPiece.toFixed(2)}`,
			`₱${(item.quantity * item.pricePerPiece).toFixed(2)}`,
		]);

		setData(formattedProducts);
	}, [products]);

	return (
		<div className="ProductTable">
			<TableNormal columns={columns} data={data} />
		</div>
	);
};
