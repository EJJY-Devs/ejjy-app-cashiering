import { message, Modal, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { request } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { AddProductForm } from './AddProductForm';
import './style.scss';

interface Props {
	branchProduct: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const AddProductModal = ({ branchProduct, visible, onClose, onSuccess }: Props) => {
	// REFS
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { updateTransaction, status } = useTransactions();
	const { transactionId, transactionProducts, addProduct, setCurrentTransaction } =
		useCurrentTransaction();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const onSubmit = (data) => {
		const callback = () => {
			message.success('Product sucessfully added.');
			onSuccess();
			onClose();
		};

		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: [
						...transactionProducts.map((item) => ({
							transaction_product_id: item.transactionProductId,
							product_id: item.product.id,
							quantity: item.quantity,
							price_per_piece: item.price_per_piece,
						})),
						{
							product_id: branchProduct.product.id,
							price_per_piece: branchProduct.price_per_piece,
							quantity: data.quantity,
						},
					],
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction });
						callback();
					}
				},
			);
		} else {
			// NOTE: Setting of product
			addProduct({
				product: {
					...branchProduct,
					quantity: data.quantity,
				},
			});
			callback();
		}
	};

	return (
		<Modal
			title="Add Product"
			className="AddProductModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<AddProductForm
					inputRef={(el) => (inputRef.current = el)}
					maxQuantity={branchProduct?.current_balance}
					unitOfMeasurementType={branchProduct?.product?.unit_of_measurement}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			</Spin>
		</Modal>
	);
};
