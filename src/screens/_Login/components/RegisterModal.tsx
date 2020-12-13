/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Spin } from 'antd';
import React from 'react';
import { LoginForm } from './LoginForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const RegisterModal = ({ visible, onClose }: Props) => {
	const onRegister = (data) => {};

	return (
		<Modal
			title="Machine Registration"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={false}>
				<LoginForm onSubmit={onRegister} submitText="Submit" loading={false} errors={[]} />
			</Spin>
		</Modal>
	);
};
