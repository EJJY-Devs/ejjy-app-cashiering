/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { TableNormal } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import { formatDateTime, numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	onMidSession: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

const columns = [{ name: 'ID' }, { name: 'Date' }, { name: 'Amount' }];

export const OthersModal = ({ onMidSession, onEndSession, visible, onClose }: Props) => {
	const {
		transactionId,
		products,
		setCurrentTransaction,
		createCurrentTransaction,
	} = useCurrentTransaction();
	const { transactions } = useTransactions();
	const { branchProducts } = useBranchProducts();
	const { setMainLoading, setMainLoadingText } = useUI();

	const [heldTransactions, setHeldTransctions] = useState([]);

	useEffect(() => {
		const formattedTransactions = transactions.map((transaction) => [
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
			<TableNormal columns={columns} data={heldTransactions} />

			<button className="other-button btn-cash-breakdown" onClick={onMidSession}>
				Cash Break Down
			</button>

			<button className="other-button btn-end-session" onClick={onEndSession}>
				End Session
			</button>
		</Modal>
	);
};
