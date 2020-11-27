import { Divider, message, Modal, Spin } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { EditProductForm } from './EditProductForm';
import './style.scss';

interface Props {
	product: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const EditProductModal = ({ product, visible, onClose, onSuccess }: Props) => {
	const { branchProducts } = useBranchProducts();
	const { updateTransaction, status } = useTransactions();
	const { products, transactionId, editProduct, setCurrentTransaction } = useCurrentTransaction();

	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const getMaxQuantity = useCallback(() => {
		if (branchProducts.length && product) {
			const branchProduct = branchProducts.find(
				(bProduct) => bProduct.product?.id === product.productId,
			);

			if (branchProduct) {
				return branchProduct.current_balance;
			}
		}

		return 0;
	}, [branchProducts, product]);

	const onSubmit = (data) => {
		const quantity = data.quantity;

		const callback = () => {
			message.success('Product sucessfully edited.');
			onSuccess();
			onClose();
		};

		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: [
						...products
							.filter(
								({ transactionProductId }) => transactionProductId !== product.transactionProductId,
							)
							.map((item) => ({
								transaction_product_id: item.transactionProductId,
								product_id: item.productId,
								price_per_piece: item.pricePerPiece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: product.transactionProductId,
							product_id: product.productId,
							price_per_piece: product.pricePerPiece,
							quantity,
						},
					],
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction, branchProducts });
						callback();
					}
				},
			);
		} else {
			editProduct({ id: product.id, quantity });
			callback();
		}
	};

	return (
		<Modal
			title="Edit Product"
			className="EditProductModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<DetailsRow>
					<DetailsSingle
						classNamesLabel="label"
						classNamesValue="value"
						label="Product Name:"
						value={product?.productName}
					/>
				</DetailsRow>

				<Divider dashed />

				<EditProductForm
					inputRef={(el) => (inputRef.current = el)}
					maxQuantity={getMaxQuantity()}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			</Spin>
		</Modal>
	);
};
