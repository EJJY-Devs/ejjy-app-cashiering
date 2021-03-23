/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React from 'react';
import { LoginForm } from '../../../_Login/components/LoginForm';

interface Props {
	visible: boolean;
	isLoading: boolean;
	onConfirm: any;
	onClose: any;
}

export const VoidAuthModal = ({ onConfirm, isLoading, visible, onClose }: Props) => {
	return (
		<Modal
			title="Manager's Approval"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<LoginForm
				onSubmit={onConfirm}
				submitText="Submit"
				loading={isLoading}
				errors={[]}
				isManager
			/>
		</Modal>
	);
};
