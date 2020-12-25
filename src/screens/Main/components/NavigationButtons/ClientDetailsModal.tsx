/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React from 'react';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { ClientDetailsForm } from './ClientDetailsForm';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const ClientDetailsModal = ({ visible, onClose }: Props) => {
	const { setClient } = useCurrentTransaction();

	const onSubmit = (data) => {
		setClient(data);
		onClose();
	};

	return (
		<Modal
			title="Client Details"
			className="ClientDetailsModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<ClientDetailsForm onSubmit={onSubmit} onClose={onClose} />
		</Modal>
	);
};
