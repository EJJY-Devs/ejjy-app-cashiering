/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Spin } from 'antd';
import React from 'react';
import { LoginForm } from '../../_Login/components/LoginForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const ReportAccessModal = ({ visible, onClose }: Props) => {
	const onSubmit = (data) => {};

	return (
		<Modal
			title="Manager's Approval"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={false}>
				<LoginForm onSubmit={onSubmit} submitText="Submit" loading={false} errors={[]} />
			</Spin>
		</Modal>
	);
};
