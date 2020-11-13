/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { CancelButtonIcon, TableNormalProducts } from '../../../../../components';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import { EditProductModal } from './EditProductModal';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', center: true },
	{ name: 'Rate', center: true },
	{ name: 'Amount', center: true },
];

const NO_INDEX_SELECTED = -1;

export const editTypes = {
	ADD: 1,
	DEDUCT: 2,
};

export const ProductTable = () => {
	const { branchProducts } = useBranchProducts();
	const { products, removeProduct } = useCurrentTransaction();

	const [selectedProductIndex, setSelectedProductIndex] = useState(NO_INDEX_SELECTED);
	const [editProductModalVisible, setEditProductModalVisible] = useState(false);
	const [editType, setEditType] = useState(null);
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

	const canAddQuantity = useCallback(() => {
		const product = products?.[selectedProductIndex];
		if (selectedProductIndex !== NO_INDEX_SELECTED && product) {
			const branchProduct = branchProducts.find(
				(bProduct) => bProduct.product?.id === product.productId,
			);

			return product.quantity < branchProduct.current_balance;
		}

		return false;
	}, [selectedProductIndex, products, branchProducts]);

	const canDeductQuantity = useCallback(() => {
		const product = products?.[selectedProductIndex];
		if (selectedProductIndex !== NO_INDEX_SELECTED && product) {
			return product.quantity > 1;
		}

		return false;
	}, [selectedProductIndex, products]);

	const onHover = (index) => {
		setSelectedProductIndex(index);
	};

	const onExit = () => {
		if (!editProductModalVisible) {
			setSelectedProductIndex(NO_INDEX_SELECTED);
		}
	};

	const handleKeyPress = (key) => {
		if (['f1', 'f2'].includes(key) && selectedProductIndex === NO_INDEX_SELECTED) {
			message.error('Please select a product from the table first.');
			return;
		}

		if (key === 'f1' && !canAddQuantity()) {
			message.error('Product quantity already reached maximum remaining stocks.');
			return;
		}

		if (key === 'f2' && !canDeductQuantity()) {
			message.error('Product must have at least one (1) quantity.');
			return;
		}

		if (key === 'f1') {
			setEditType(editTypes.ADD);
		}

		if (key === 'f2') {
			setEditType(editTypes.DEDUCT);
		}

		setEditProductModalVisible(true);
	};

	const onEditProductSuccess = () => {
		setEditType(null);
		setSelectedProductIndex(NO_INDEX_SELECTED);
	};

	return (
		<div className="ProductTable">
			<KeyboardEventHandler
				handleKeys={['f1', 'f2']}
				onKeyEvent={(key, e) => handleKeyPress(key)}
				isDisabled={!products.length}
			/>

			<TableNormalProducts columns={columns} data={data} onHover={onHover} onExit={onExit} />

			<EditProductModal
				product={products?.[selectedProductIndex]}
				editType={editType}
				visible={editProductModalVisible}
				onSuccess={onEditProductSuccess}
				onClose={() => setEditProductModalVisible(false)}
			/>
		</div>
	);
};
