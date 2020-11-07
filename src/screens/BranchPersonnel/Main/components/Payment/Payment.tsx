import React, { useCallback } from 'react';
import { Button } from '../../../../../components/elements';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';

export const Payment = () => {
	const { products } = useCurrentTransaction();

	const getTotal = useCallback(
		() =>
			Number(
				Object.values(products).reduce(
					(prev: number, { quantity, price_per_piece }) => quantity * price_per_piece + prev,
					0,
				),
			),
		[products],
	);

	return (
		<div className="Payment">
			<div className="payment-content">
				<div className="text-wrapper">
					<p className="label">Total</p>
					<p className="value">{`₱${getTotal()?.toFixed(2)}`}</p>
				</div>
				<Button classNames="btn-pay" text="Pay" size="lg" variant="primary" />
			</div>
			<div className="pending-balance-wrapper">
				<p className="label">Pending Balance</p>
				<p className="value">{`₱100.00`}</p>
			</div>
		</div>
	);
};
