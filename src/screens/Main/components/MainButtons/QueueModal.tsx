/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import cn from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ButtonLink } from '../../../../components/elements';
import { TableQueue } from '../../../../components/TableQueue/TableQueue';
import { NO_INDEX_SELECTED } from '../../../../global/constants';
import { request, transactionStatusTypes } from '../../../../global/types';
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

export const QueueModal = ({ visible, onClose }: Props) => {
	// STATES
	const [filteredTransactions, setFilteredTransactions] = useState([]);
	const [queuedTransactions, setQueuedTransactions] = useState([]);
	const [activeIndex, setActiveIndex] = useState(NO_INDEX_SELECTED);

	// CUSTOM HOOKS
	const { session } = useSession();
	const {
		transactionId,
		transactionProducts,
		transactionStatus,
		setCurrentTransaction,
		createCurrentTransaction,
		requestStatus: transactionsRequestStatus,
	} = useCurrentTransaction();
	const { transactions, listTransactions, status: transactionsStatus } = useTransactions();
	const { branchProducts } = useBranchProducts();
	const { setMainLoading, setMainLoadingText } = useUI();

	// METHODS
	// Effect: Fetch transactions
	useEffect(() => {
		if (visible) {
			listTransactions({
				status: transactionStatusTypes.QUEUE,
				branchMachineId: session?.branch_machine?.id,
				tellerId: session?.user_id,
			});
		}
	}, [visible]);

	// Effect: Format transactions
	useEffect(() => {
		const filtredTransactions = transactions.filter(
			(transaction) => transaction.status === transactionStatusTypes.QUEUE,
		);

		const formattedTransactions = filtredTransactions.map((transaction) => [
			<ButtonLink text={transaction.id} onClick={() => checkCurrentTransaction(transaction)} />,
			formatDateTime(transaction.datetime_created),
			`₱${numberWithCommas(transaction.total_amount?.toFixed(2))}`,
		]);

		setActiveIndex(formattedTransactions.length > 0 ? 0 : NO_INDEX_SELECTED);
		setQueuedTransactions(formattedTransactions);
		setFilteredTransactions(filtredTransactions);
	}, [transactions, transactionId, transactionProducts]);

	const isQueueDisabled = useCallback(
		() => transactionStatus !== null || !transactionProducts.length,
		[transactionStatus, transactionProducts],
	);

	const checkCurrentTransaction = (transaction) => {
		onClose();

		if (!transactionId && transactionProducts?.length > 0) {
			setMainLoading(true);
			setMainLoadingText('Saving current transaction...');
			createCurrentTransaction(({ status }) => {
				if (status === request.SUCCESS) {
					onViewTransaction(transaction);
				} else if (status === request.ERROR) {
					message.error('An error occurred while creating transaction');
				}

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

	const onQueue = () => {
		createCurrentTransaction(({ status }) => {
			if (status === request.SUCCESS) {
				message.success('Transaction successfully queued.');
				onClose();
			} else if (status === request.ERROR) {
				message.error('An error occurred while queueing the transaction');
			}
		});
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		// Queue
		if (key === 'f1' && !isQueueDisabled()) {
			onQueue();
			return;
		}

		// View queued transaction
		if (
			key === 'enter' &&
			activeIndex !== NO_INDEX_SELECTED &&
			queuedTransactions.length &&
			filteredTransactions.length
		) {
			checkCurrentTransaction(filteredTransactions[activeIndex]);
			return;
		}

		// Select queued transcation
		if (key === 'up' && queuedTransactions.length) {
			setActiveIndex((index) => (index > 0 ? index - 1 : index));
			return;
		}

		if (key === 'down' && queuedTransactions.length) {
			setActiveIndex((index) => (index < queuedTransactions.length - 1 ? index + 1 : index));
			return;
		}
	};

	return (
		<Modal
			title="Queue & Resume"
			className="QueueModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
			destroyOnClose
		>
			<KeyboardEventHandler
				handleKeys={['f1', 'enter', 'up', 'down']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<Spin size="large" spinning={transactionsRequestStatus === request.REQUESTING}>
				<button className={cn('btn-queue', { disabled: isQueueDisabled() })} onClick={onQueue}>
					<>
						<span>Queue</span>
						<span className="shortcut-key">[F1]</span>
					</>
				</button>

				<TableQueue
					activeRow={activeIndex}
					columns={columns}
					data={queuedTransactions}
					loading={transactionsStatus === request.REQUESTING}
				/>
			</Spin>
		</Modal>
	);
};
