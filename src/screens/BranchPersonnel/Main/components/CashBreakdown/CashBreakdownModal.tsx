/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { FieldError } from '../../../../../components/elements';
import { types as cashBreakdownsRequestTypes } from '../../../../../ducks/cash-breakdowns';
import { request } from '../../../../../global/types';
import { useCashBreakdown } from '../../../../../hooks/useCashBreakdown';
import { CashBreakdownForm } from './CashBreakdownForm';

interface Props {
	type: string;
	sessionId: number;
	visible: boolean;
	required: boolean;
	onClose: any;
	onSuccess: any;
}

export const CashBreakdownModal = ({
	sessionId,
	type,
	required,
	visible,
	onSuccess,
	onClose,
}: Props) => {
	const { createCashBreakdown, status, recentRequest, errors, reset } = useCashBreakdown();

	// Effect: Close modal if recent requests are Create or Edit
	useEffect(() => {
		if (
			status === request.SUCCESS &&
			recentRequest === cashBreakdownsRequestTypes.CREATE_CASH_BREAKDOWN
		) {
			reset();
			onSuccess();
		}
	}, [status, recentRequest, reset, onClose]);

	const close = () => {
		if (required) {
			message.error('Cash breakdown is required.');
		} else {
			onClose();
		}
	};

	const onSubmit = (data) => {
		if (sessionId && type) {
			createCashBreakdown({
				...data,
				type,
				cashiering_session_id: sessionId,
			});
		} else {
			message.error('An error occured before submitting the cash breakdown.');
		}
	};

	return (
		<Modal
			title="Cash Breakdown"
			className="CashBreakdownModal"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<CashBreakdownForm
				onSubmit={onSubmit}
				onClose={close}
				loading={status === request.REQUESTING}
			/>
		</Modal>
	);
};
