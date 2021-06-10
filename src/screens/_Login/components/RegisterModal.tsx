/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { FieldError } from '../../../components/elements';
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
	const [branchMachines, setBranchMachines] = useState([]);
	const [branchMachinesOptions, setBranchMachinesOptions] = useState([]);

	// CUSTOM HOOKS
	const { registerBranchMachine, getBranchMachines, status, errors } = useBranchMachines();

	// METHODS
	useEffect(() => {
		if (visible) {
			setBranchMachinesOptions([]);
			getBranchMachines({
				onSuccess: ({ response: { results } }) => {
					setBranchMachines(results);
					setBranchMachinesOptions(
						results.map(({ name }) => ({
							name,
							value: name,
						})),
					);
				},
			});
		}
	}, [visible]);

	const onRegister = (data) => {
		const branchMachineId = branchMachines.find(
			(branchMachine) => branchMachine.name === data.machineName,
		)?.id;

		registerBranchMachine(
			{ ...data, branchMachineId },
			{
				onSuccess: ({ response }) => {
					localStorage.setItem(MACHINE_ID_KEY, branchMachineId);
					localStorage.setItem(MACHINE_COUNT_KEY, response);
					message.success('This machine is successfully registered.');
					onClose();
				},
			},
		);
	};

	// console.log('errors', errors);

	return (
		<Modal
			title="Machine Registration"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
			destroyOnClose
		>
			<Spin size="large" spinning={status === request.REQUESTING}>
				{errors.map((error, index) => (
					<FieldError key={index} error={error} />
				))}
				<RegisterForm
					branchMachinesOptions={branchMachinesOptions}
					onSubmit={onRegister}
					loading={status === request.REQUESTING}
				/>
			</Spin>
		</Modal>
	);
};
