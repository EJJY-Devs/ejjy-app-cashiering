import { Divider, message, Modal, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { request } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { EditProductForm } from './EditProductForm';
import './style.scss';

interface Props {
	branchProduct: any;
	visible: boolean;
	onClose: any;
}

export const EditProductModal = ({ branchProduct, visible, onClose }: Props) => {
	// CUSTOM HOOKS
	const { updateTransaction, status } = useTransactions();
	const { transactionId, transactionProducts, editProduct, setCurrentTransaction } =
		useCurrentTransaction();

	// REFS
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const onSubmit = (data) => {
		const quantity = data.quantity;

		const callback = () => {
			message.success('Product sucessfully edited.');
			onClose();
		};

		if (transactionId) {
			// TODO: UPDATE
			updateTransaction(
				{
					transactionId,
					products: [
						...transactionProducts
							.filter(
								({ transactionProductId }) =>
									transactionProductId !== branchProduct.transactionProductId,
							)
							.map((item) => ({
								transaction_product_id: item.transactionProductId,
								product_id: item.product.id,
								price_per_piece: item.price_per_piece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: branchProduct.transactionProductId,
							product_id: branchProduct.product.id,
							price_per_piece: branchProduct.price_per_piece,
							quantity,
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
			editProduct({ id: branchProduct.id, quantity });
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
						value={branchProduct?.product?.name}
					/>
				</DetailsRow>

				<Divider dashed />

				<EditProductForm
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
