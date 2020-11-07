import React, { useEffect, useState } from 'react';
import { CancelButtonIcon, TableNormal } from '../../../../../components';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';

const columns = [
	{ name: '', width: '100px' },
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
			item.product.name,
			item.quantity.toFixed(3),
			`₱${item.price_per_piece.toFixed(2)}`,
			`₱${(item.quantity * item.price_per_piece).toFixed(2)}`,
		]);

		setData(formattedProducts);
	}, [products]);

	return (
		<div className="ProductTable">
			<TableNormal columns={columns} data={data} />
		</div>
	);
};
