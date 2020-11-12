import { message, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import { AddProductForm } from './AddProductForm';
import './style.scss';

interface Props {
	product: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const AddProductModal = ({ product, visible, onClose, onSuccess }: Props) => {
	const { addProduct } = useCurrentTransaction();

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
		addProduct({
			product: {
				id: product.id,
				productId: product.product.id,
				productName: product.product.name,
				pricePerPiece: product.price_per_piece,
				quantity: data.quantity,
			},
		});
		message.success('Product sucessfully added.');

		onSuccess();
		onClose();
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
			<AddProductForm
				inputRef={(el) => (inputRef.current = el)}
				maxQuantity={product?.current_balance}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
