/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React from 'react';
import { MACHINE_ID_KEY } from '../../../global/constants';
import { request } from '../../../global/types';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
import { RegisterForm } from './RegisterForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const RegisterModal = ({ visible, onClose }: Props) => {
	const { registerBranchMachine, status: registerRequestStatus } = useBranchMachines();
	const onRegister = (data) => {
		registerBranchMachine(data, ({ status, response, errors }) => {
			if (status === request.ERROR) {
				message.error(errors);
			} else if (status === request.SUCCESS) {
				localStorage.setItem(MACHINE_ID_KEY, response.id);
				message.success('This machine is successfully registered.');
				onClose();
			}
		});
	};

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
				<RegisterForm
					onSubmit={onRegister}
					loading={registerRequestStatus === request.REQUESTING}
				/>
			</Spin>
		</Modal>
	);
};
