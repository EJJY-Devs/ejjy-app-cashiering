/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { request } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { useTransactions } from '../../../../hooks/useTransactions';
import { removeCommas } from '../../../../utils/function';
import { PaymentForm } from './PaymentForm';
import './style.scss';

interface Props {
	amountDue: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const PaymentModal = ({ amountDue, visible, onClose, onSuccess }: Props) => {
	// STATES
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { session } = useSession();
	const {
		transactionId: currentTransactionId,
		setPreviousChange,
		createCurrentTransaction,
		requestStatus: createTransactionStatus,
	} = useCurrentTransaction();
	const { payTransaction, status: paymentStatus } = useTransactions();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const onSubmit = (formData) => {
		if (currentTransactionId) {
			onPayTransaction(currentTransactionId, formData.amountTendered);
		} else {
			createCurrentTransaction({
				callback: ({ status, response }) => {
					if (status === request.SUCCESS) {
						onPayTransaction(response.id, formData.amountTendered);
					} else if (status === request.ERROR) {
						message.error('An error occurred while creating transaction');
					}
				},
				shouldResetTransaction: false,
			});
		}
	};

	const onPayTransaction = (transactionId, amountTendered) => {
		let amountTenderedNumber = removeCommas(amountTendered);

		const data = {
			transactionId,
			amountTendered: amountTenderedNumber,
			cashierUserId: session.user.id,
		};

		const change = amountTenderedNumber - amountDue;
		payTransaction(data, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response.is_fully_paid && response?.invoice.id) {
					setPreviousChange(change);
					onSuccess(response);
				}
				onClose();
			} else if (status === request.ERROR) {
				message.error('An error occured while processing the payment.');
			}
		});
	};

	return (
		<Modal
			title="Pay"
			className="PaymentModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin
				size="large"
				spinning={[createTransactionStatus, paymentStatus].includes(request.REQUESTING)}
			>
				<PaymentForm
					amountDue={amountDue}
					inputRef={(el) => (inputRef.current = el)}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			</Spin>
		</Modal>
	);
};
