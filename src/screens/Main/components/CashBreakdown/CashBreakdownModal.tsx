/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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
	const firstInputRef = useRef(null);
	const lastInputRef = useRef(null);
	const btnSubmitRef = useRef(null);
	const btnCancelRef = useRef(null);

	// CUSTOM HOOKS
	const { session } = useSession();
	const { createCashBreakdown, status, recentRequest, errors, reset } = useCashBreakdown();

	useEffect(() => {
		if (visible && firstInputRef?.current) {
			setTimeout(() => {
				firstInputRef.current?.focus();
			}, 500);
		}
	}, [visible, firstInputRef]);

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

	const handleKeyPress = (key, event) => {
		if (key === 'tab') {
			let inputRef = null;
			let { activeElement } = document;

			if (activeElement === lastInputRef.current) {
				inputRef = btnSubmitRef;
			} else if (activeElement === btnSubmitRef.current) {
				inputRef = required ? firstInputRef : btnCancelRef;
			} else if (activeElement === btnCancelRef.current) {
				inputRef = firstInputRef;
			}

			if (inputRef?.current) {
				event.preventDefault();
				event.stopPropagation();

				inputRef.current?.focus();
			}
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

			<KeyboardEventHandler
				handleKeys={['f1', 'f2', 'f3', 'f4', 'tab']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<CashBreakdownForm
				firstInputRef={firstInputRef}
				lastInputRef={lastInputRef}
				btnSubmitRef={btnSubmitRef}
				btnCancelRef={btnCancelRef}
				required={required}
				onSubmit={onSubmit}
				onClose={close}
				loading={status === request.REQUESTING}
			/>
		</Modal>
	);
};
