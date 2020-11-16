/* eslint-disable react-hooks/exhaustive-deps */
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { NO_INDEX_SELECTED } from '../../../../global/constants';
import { navigationTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import './style.scss';

export const NavigationButtons = () => {
	const {
		transactionId,
		invoiceId,
		products,
		setCurrentTransaction,
		createCurrentTransaction,
	} = useCurrentTransaction();
	const { transactions } = useTransactions();
	const { branchProducts } = useBranchProducts();
	const { transactionIndex, setTransactionIndex, setMainLoading, setMainLoadingText } = useUI();

	// Effect: Update current transaction from navigated transaction
	useEffect(() => {
		if (transactionIndex !== NO_INDEX_SELECTED && transactions?.[transactionIndex]) {
			setCurrentTransaction({ transaction: transactions[transactionIndex], branchProducts });
		}
	}, [transactionIndex, transactions, branchProducts]);

	const checkCurrentTransaction = (type) => {
		if (!transactionId && products?.length > 0) {
			setMainLoading(true);
			setMainLoadingText('Saving current transaction...');
			createCurrentTransaction(() => {
				navigate(type);

				setMainLoading(false);
				setMainLoadingText(null);
			});
		} else {
			navigate(type);
		}
	};

	const navigate = (type) => {
		switch (type) {
			case navigationTypes.PREVIOUS: {
				setTransactionIndex(transactionIndex > 0 ? transactionIndex - 1 : transactionIndex);
				break;
			}
			case navigationTypes.NEXT: {
				setTransactionIndex(
					transactionIndex < transactions?.length - 1 ? transactionIndex + 1 : transactionIndex,
				);
				break;
			}
		}
	};

	return (
		<div className="NavigationButtons">
			<div className="details">
				<div className="item">
					<p className="label">Client ID:</p>
					<p className="value">—</p>
				</div>
				<div className="item">
					<p className="label">Transaction No:</p>
					<p className="value">{transactionId || '—'}</p>
				</div>
				<div className="item">
					<p className="label">Invoice No:</p>
					<p className="value">{invoiceId || '—'}</p>
				</div>
				<div className="item previous-sukli">
					<p className="label">Previous Sukli:</p>
					<p className="value">—</p>
				</div>
			</div>
			<div className="buttons">
				<button
					className={cn('NavigationButton btn-prev', {
						disabled:
							transactions.length === 0 || [0, NO_INDEX_SELECTED].includes(transactionIndex),
					})}
					onClick={() => checkCurrentTransaction(navigationTypes.PREVIOUS)}
				>
					<CaretLeftOutlined color="red" />
				</button>

				<button
					className={cn('NavigationButton btn-next', {
						disabled: transactions.length === 0 || transactionIndex >= transactions.length - 1,
					})}
					onClick={() => checkCurrentTransaction(navigationTypes.NEXT)}
				>
					<CaretRightOutlined />
				</button>
			</div>
		</div>
	);
};
