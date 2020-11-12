import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { navigationTypes } from '../../../../../global/types';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../../hooks/useTransactions';
import './style.scss';

const NO_TRANSACTION_SELECTED = -1;

export const NavigationButtons = () => {
	const {
		transactionId,
		products,
		setCurrentTransaction,
		createCurrentTransaction,
	} = useCurrentTransaction();
	const { transactions } = useTransactions();
	const { branchProducts } = useBranchProducts();

	const [currentIndex, setCurrentIndex] = useState(NO_TRANSACTION_SELECTED);

	// Effect: Update current transaction from navigated transaction
	useEffect(() => {
		if (currentIndex !== NO_TRANSACTION_SELECTED && transactions?.[currentIndex]) {
			setCurrentTransaction({ transaction: transactions[currentIndex], branchProducts });
		}
	}, [currentIndex, transactions]);

	const checkCurrentTransaction = (type) => {
		if (!transactionId && products?.length > 0) {
			createCurrentTransaction(() => {
				navigate(type);
			});
		} else {
			navigate(type);
		}
	};

	const navigate = (type) => {
		switch (type) {
			case navigationTypes.PREVIOUS: {
				setCurrentIndex((value) => (value > 0 ? value - 1 : value));
				break;
			}
			case navigationTypes.NEXT: {
				setCurrentIndex((value) => (value < transactions?.length - 1 ? value + 1 : value));
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
					<p className="value">—</p>
				</div>
				<div className="item">
					<p className="label">Invoice No:</p>
					<p className="value">—</p>
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
							transactions.length === 0 || [0, NO_TRANSACTION_SELECTED].includes(currentIndex),
					})}
					onClick={() => checkCurrentTransaction(navigationTypes.PREVIOUS)}
				>
					<CaretLeftOutlined color="red" />
				</button>

				<button
					className={cn('NavigationButton btn-next', {
						disabled: transactions.length === 0 || currentIndex >= transactions.length - 1,
					})}
					onClick={() => checkCurrentTransaction(navigationTypes.NEXT)}
				>
					<CaretRightOutlined />
				</button>
			</div>
		</div>
	);
};
