/* eslint-disable react-hooks/exhaustive-deps */
import { message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { CancelButtonIcon, TableNormalProducts } from '../../../../components';
import { PRODUCT_LENGTH_PER_PAGE } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { numberWithCommas } from '../../../../utils/function';
import { EditProductModal } from './EditProductModal';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', width: '15%' },
	{ name: 'Rate', width: '15%' },
	{ name: 'Amount' },
];

const NO_INDEX_SELECTED = -1;

export const editTypes = {
	ADD: 1,
	DEDUCT: 2,
};

interface Props {
	isLoading: boolean;
}

export const ProductTable = ({ isLoading }: Props) => {
	const {
		transactionId,
		products,
		pageNumber,
		isFullyPaid,
		removeProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();
	const { branchProducts } = useBranchProducts();
	const { updateTransaction, status } = useTransactions();

	const [selectedProductIndex, setSelectedProductIndex] = useState(NO_INDEX_SELECTED);
	const [editProductModalVisible, setEditProductModalVisible] = useState(false);

	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = products
			.slice((pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE, pageNumber * PRODUCT_LENGTH_PER_PAGE)
			.map((item) => [
				isFullyPaid ? null : (
					<CancelButtonIcon tooltip="Remove" onClick={() => onRemoveProduct(item.id)} />
				),
				<Tooltip placement="top" title={item.productDescription}>
					{item.productName}
				</Tooltip>,
				item.quantity.toFixed(3),
				`₱${numberWithCommas(item.pricePerPiece.toFixed(2))}`,
				`₱${numberWithCommas((item.quantity * item.pricePerPiece).toFixed(2))}`,
			]);

		setData(formattedProducts);
	}, [products, pageNumber]);

	const onRemoveProduct = (id) => {
		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: products
						.filter((item) => item.id !== id)
						.map((item) => ({
							transaction_product_id: item.transactionProductId,
							product_id: item.productId,
							quantity: item.quantity,
						})),
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction, branchProducts });
					}
				},
			);
		} else {
			removeProduct({ id });
		}
	};

	const onHover = (index) => {
		setSelectedProductIndex((pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE + index);
	};

	const onExit = () => {
		if (!editProductModalVisible) {
			setSelectedProductIndex(NO_INDEX_SELECTED);
		}
	};

	const handleKeyPress = (key) => {
		if (key === 'f1' && selectedProductIndex === NO_INDEX_SELECTED) {
			message.error('Please select a product from the table first.');
			return;
		}

		setEditProductModalVisible(true);
	};

	const onEditProductSuccess = () => {
		setSelectedProductIndex(NO_INDEX_SELECTED);
	};

	return (
		<div className="ProductTable">
			<KeyboardEventHandler
				handleKeys={['f1']}
				onKeyEvent={(key, e) => handleKeyPress(key)}
				isDisabled={!products.length || isFullyPaid}
			/>

			<TableNormalProducts
				columns={columns}
				data={data}
				onHover={onHover}
				onExit={onExit}
				loading={status === request.REQUESTING || isLoading}
			/>

			<EditProductModal
				product={products?.[selectedProductIndex]}
				visible={editProductModalVisible}
				onSuccess={onEditProductSuccess}
				onClose={() => setEditProductModalVisible(false)}
			/>
		</div>
	);
};
