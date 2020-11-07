import { message, Modal } from 'antd';
import React from 'react';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import { AddProductForm } from './AddProductForm';

interface Props {
	product: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const AddProductModal = ({ product, visible, onClose, onSuccess }: Props) => {
	const { addProduct } = useCurrentTransaction();

	const onSubmit = (data) => {
		addProduct({ product: { ...product, quantity: data.quantity } });
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
			<AddProductForm onSubmit={onSubmit} onClose={onClose} />
		</Modal>
	);
};
