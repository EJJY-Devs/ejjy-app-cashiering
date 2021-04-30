/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { SetUrlForm } from './SetUrlForm';
import { message } from 'antd';

interface Props {
	visible: boolean;
	onClose: any;
}

export const SetUrlModal = ({ visible, onClose }: Props) => {
	// CUSTOM HOOKS
	const { loginBranchManager, status, reset } = useAuth();

	// METHODS
	useEffect(() => {
		if (status === request.SUCCESS) {
			message.success('Successfully updated the Local API URL');
		}
	}, [status]);

	const onLogin = (data) => {
		loginBranchManager(data);
	};

	const close = () => {
		reset();
	};

	return (
		<Modal title="Set API URL" visible={visible} footer={null} onCancel={close} centered closable>
			<SetUrlForm onSubmit={onLogin} loading={status === request.REQUESTING} />
		</Modal>
	);
};
