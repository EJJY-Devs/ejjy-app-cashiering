/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
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
import { SearchTransaction } from './SearchTransaction';
import './style.scss';

interface Props {
	onMidSession: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

const columns = [{ name: 'ID' }, { name: 'Date' }, { name: 'Amount' }];

export const OthersModal = ({ onMidSession, onEndSession, visible, onClose }: Props) => {
	const { session } = useSession();
	const {
		transactionId,
		products,
		setCurrentTransaction,
		createCurrentTransaction,
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

	return (
		<Modal
			title="Others"
			className="OthersModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<SearchTransaction closeModal={onClose} />

			<TableNormal
				columns={columns}
				data={heldTransactions}
				loading={transactionsStatus === request.REQUESTING}
			/>

			<button className="other-button btn-cash-breakdown" onClick={onMidSession}>
				Cash Break Down
			</button>

			<button className="other-button btn-end-session" onClick={onEndSession}>
				End Session
			</button>
		</Modal>
	);
};
