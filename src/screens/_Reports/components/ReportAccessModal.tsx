/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal } from 'antd';
import React from 'react';
import { reportTypes, request } from '../../../global/types';
import { useReports } from '../../../hooks/useReports';
import { getBranchMachineId } from '../../../utils/function';
import { LoginForm } from '../../_Login/components/LoginForm';

interface Props {
	reportType: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const ReportAccessModal = ({ reportType, onSuccess, visible, onClose }: Props) => {
	const { createXreadReport, createZreadReport, status } = useReports();

	const onSubmit = (formData) => {
		const createReport = reportType === reportTypes.XREAD ? createXreadReport : createZreadReport;
		const data = {
			...formData,
			branchMachineId: getBranchMachineId(),
		};

		createReport(data, ({ status, errors, response }) => {
			if (status === request.ERROR) {
				message.error(errors);
			} else if (status === request.SUCCESS) {
				onClose();
				onSuccess(response);
			}
		});
	};

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
				onSubmit={onSubmit}
				submitText="Submit"
				loading={status === request.REQUESTING}
				errors={[]}
			/>
		</Modal>
	);
};
