import { Modal, Spin } from 'antd';
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
	const { session } = useSession();
	const { transactionId, products: transactionProducts } = useCurrentTransaction();
	const { payTransaction, firstTimePayment, status } = useTransactions();

	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const onSubmit = (formData) => {
		const products = transactionProducts.map((product) => ({
			product_id: product.productId,
			quantity: product.quantity,
			price_per_piece: product.pricePerPiece,
		}));

		const data = {
			branchId: session?.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user.id,
			dummyClientId: 1, // TODO: Update on next sprint
			products,
			amountTendered: removeCommas(formData.amountTendered),
			transactionId,
		};

		if (transactionId) {
			payTransaction(data, ({ status }) => {
				if (status === request.SUCCESS) {
					onSuccess();
					onClose();
				}
			});
		} else {
			firstTimePayment(data, ({ status, response }) => {
				if (status === request.SUCCESS) {
					if (response.is_fully_paid && response?.invoice.id) {
						onSuccess();
					}
					onClose();
				}
			});
		}
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
			<Spin size="large" spinning={status === request.REQUESTING}>
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
