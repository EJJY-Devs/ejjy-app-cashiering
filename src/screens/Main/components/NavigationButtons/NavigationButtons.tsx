/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import './style.scss';

export const NavigationButtons = () => {
	const { transactionId, invoiceId } = useCurrentTransaction();

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
			{/* <div className="buttons">
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
			</div> */}
		</div>
	);
};
