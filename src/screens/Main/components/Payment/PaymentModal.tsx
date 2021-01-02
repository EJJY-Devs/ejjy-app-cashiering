/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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
	const [loading, setLoading] = useState(false);
	const [transactionId, setTransactionId] = useState(null);

	// CUSTOM HOOKS
	const { session } = useSession();
	const { setPreviousSukli, createCurrentTransaction } = useCurrentTransaction();
	const { payTransaction, status } = useTransactions();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	useEffect(() => {
		if (visible && !transactionId) {
			setLoading(true);
			createCurrentTransaction(({ status, response }) => {
				if (status === request.SUCCESS) {
					setTransactionId(response.id);
					setLoading(false);
				} else if (status === request.ERROR) {
					message.error('An error occurred while setting up payment.');
					setLoading(false);
					onClose();
				}
			}, false);
		}
	}, [visible]);

	const onSubmit = (formData) => {
		const data = {
			transactionId,
			amountTendered: removeCommas(formData.amountTendered),
			cashierUserId: session.user.id,
		};

		const sukli = removeCommas(formData.amountTendered) - amountDue;
		payTransaction(data, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response.is_fully_paid && response?.invoice.id) {
					setTransactionId(null);
					setPreviousSukli(sukli);
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
			<Spin size="large" spinning={loading || status === request.REQUESTING}>
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
