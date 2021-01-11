/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { FieldError } from '../../../../components/elements';
import { printCashBreakdown } from '../../../../configurePrinter';
import { types as cashBreakdownsRequestTypes } from '../../../../ducks/cash-breakdowns';
import { request } from '../../../../global/types';
import { useCashBreakdown } from '../../../../hooks/useCashBreakdown';
import { useSession } from '../../../../hooks/useSession';
import { getCashBreakdownTypeDescription } from '../../../../utils/function';
import { CashBreakdownForm } from './CashBreakdownForm';
import './style.scss';

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
	// REFS
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { session } = useSession();
	const { createCashBreakdown, status, recentRequest, errors, reset } = useCashBreakdown();

	useEffect(() => {
		if (visible && inputRef && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const getTitle = useCallback(() => getCashBreakdownTypeDescription(type), [type]);

	const close = () => {
		if (
			status === request.SUCCESS &&
			recentRequest === cashBreakdownsRequestTypes.CREATE_CASH_BREAKDOWN
		) {
			reset();
			onSuccess();
			return;
		}

		if (required) {
			message.error('Cash breakdown is required.');
		} else {
			onClose();
		}
	};

	const onSubmit = (data) => {
		if (sessionId && type) {
			createCashBreakdown(
				{
					...data,
					type,
					cashiering_session_id: sessionId,
				},
				({ status, response }) => {
					if (status === request.SUCCESS && response) {
						printCashBreakdown(response, session, type);
						reset();
						onSuccess();
					}
				},
			);
		} else {
			message.error('An error occured before submitting the cash breakdown.');
		}
	};

	return (
		<Modal
			title={getTitle()}
			className="CashBreakdownModal"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable={!required}
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<CashBreakdownForm
				inputRef={(el) => (inputRef.current = el)}
				required={required}
				onSubmit={onSubmit}
				onClose={close}
				loading={status === request.REQUESTING}
			/>
		</Modal>
	);
};
