/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { TableNormal } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { request, transactionStatus } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import { formatDateTime, numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

const columns = [{ name: 'ID' }, { name: 'Date' }, { name: 'Amount' }];

export const HoldModal = ({ visible, onClose }: Props) => {
	const { session } = useSession();
	const {
		transactionId,
		products,
		setCurrentTransaction,
		createCurrentTransaction,
		status: currentTransactionStatus,
	} = useCurrentTransaction();
	const { transactions, listTransactions, status: transactionsStatus } = useTransactions();
	const { branchProducts } = useBranchProducts();
	const { setMainLoading, setMainLoadingText } = useUI();

	const [heldTransactions, setHeldTransctions] = useState([]);

	// Effect: Fetch transactions
	useEffect(() => {
		if (visible) {
			listTransactions({
				status: transactionStatus.HOLD,
				branchMachineId: session?.branch_machine?.id,
				tellerId: session?.user_id,
			});
		}
	}, [visible]);

	// Effect: Format transactions
	useEffect(() => {
		const formattedTransactions = transactions
			.filter((transaction) => transaction.status === transactionStatus.HOLD)
			.map((transaction) => [
				<ButtonLink text={transaction.id} onClick={() => checkCurrentTransaction(transaction)} />,
				formatDateTime(transaction.datetime_created),
				`₱${numberWithCommas(transaction.total_amount?.toFixed(2))}`,
			]);

		setHeldTransctions(formattedTransactions);
	}, [transactions, transactionId, products]);

	const checkCurrentTransaction = (transaction) => {
		onClose();

		if (!transactionId && products?.length > 0) {
			setMainLoading(true);
			setMainLoadingText('Saving current transaction...');
			createCurrentTransaction(() => {
				onViewTransaction(transaction);

				setMainLoading(false);
				setMainLoadingText(null);
			});
		} else {
			onViewTransaction(transaction);
		}
	};

	const onViewTransaction = (transaction) => {
		setCurrentTransaction({ transaction, branchProducts });
	};

	const onHold = () => {
		createCurrentTransaction(() => {
			message.success('Transaction successfully set to Hold');
			onClose();
		});
	};

	return (
		<Modal
			title="Hold & Resume"
			className="HoldModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={currentTransactionStatus === request.REQUESTING}>
				<button
					className={cn('other-button btn-cash-breakdown', {
						disabled: transactionId || !products.length,
					})}
					onClick={onHold}
				>
					Hold
				</button>

				<TableNormal
					columns={columns}
					data={heldTransactions}
					loading={transactionsStatus === request.REQUESTING}
				/>
			</Spin>
		</Modal>
	);
};
