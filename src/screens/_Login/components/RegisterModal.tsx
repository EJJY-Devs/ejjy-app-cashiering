/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { types } from '../../../ducks/branch-machines';
import { MACHINE_COUNT_KEY, MACHINE_ID_KEY } from '../../../global/constants';
import { request } from '../../../global/types';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
import { RegisterForm } from './RegisterForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const RegisterModal = ({ visible, onClose }: Props) => {
	// STATES
	const [branchMachinesOptions, setBranchMachinesOptions] = useState([]);

	// CUSTOM HOOKS
	const {
		branchMachines,
		registerBranchMachine,
		getBranchMachines,
		status,
		recentRequest,
	} = useBranchMachines();

	// METHODS
	useEffect(() => {
		getBranchMachines();
	}, []);

	useEffect(() => {
		if (status === request.SUCCESS && recentRequest === types.GET_BRANCH_MACHINES) {
			const formattedBranchMachines = branchMachines.map(({ name }) => ({
				name,
				value: name,
			}));

			setBranchMachinesOptions(formattedBranchMachines);
		}
	}, [branchMachines, status, recentRequest]);

	const onRegister = (data) => {
		const branchMachineId = branchMachines.find(
			(branchMachine) => branchMachine.name === data.machineName,
		)?.id;

		registerBranchMachine({ ...data, branchMachineId }, ({ status, errors, response }) => {
			if (status === request.ERROR) {
				message.error(errors);
			} else if (status === request.SUCCESS) {
				localStorage.setItem(MACHINE_ID_KEY, branchMachineId);
				localStorage.setItem(MACHINE_COUNT_KEY, response);

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
					branchMachinesOptions={branchMachinesOptions}
					onSubmit={onRegister}
					loading={status === request.REQUESTING}
				/>
			</Spin>
		</Modal>
	);
};
