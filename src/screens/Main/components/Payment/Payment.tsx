import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import { Button } from '../../../../components/elements';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas } from '../../../../utils/function';
import { InvoiceModal } from './InvoiceModal';
import { PaymentModal } from './PaymentModal';
import './style.scss';

export const Payment = () => {
	const { transactionProducts, isFullyPaid } = useCurrentTransaction();

	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

	const getTotal = useCallback(
		() =>
			Number(
				Object.values(transactionProducts).reduce(
					(prev: number, { quantity, pricePerPiece }) => quantity * pricePerPiece + prev,
					0,
				),
			),
		[transactionProducts],
	);

	const onPaymentSuccess = () => {
		setInvoiceModalVisible(true);
	};

	const onPay = () => {
		if (getTotal() === 0) {
			message.error('Please add a product first.');
			return;
		}

		if (isFullyPaid) {
			message.error("You've already fully paid this transaction.");
			return;
		}

		setPaymentModalVisible(true);
	};

	return (
		<div className="Payment">
			<div className="payment-content">
				<div className="text-wrapper">
					<p className="label">Total</p>
					<p className="value">{`₱${numberWithCommas(getTotal()?.toFixed(2))}`}</p>
				</div>
				<Button
					classNames="btn-pay"
					text="Pay"
					size="lg"
					variant="primary"
					onClick={onPay}
					disabled={isFullyPaid}
				/>
			</div>
			<div className="pending-balance-wrapper">
				<p className="label">Pending Balance</p>
				<p className="value">{`₱100.00`}</p>
			</div>

			<PaymentModal
				amountDue={getTotal()}
				visible={paymentModalVisible}
				onSuccess={onPaymentSuccess}
				onClose={() => setPaymentModalVisible(false)}
			/>

			<InvoiceModal visible={invoiceModalVisible} onClose={() => setInvoiceModalVisible(false)} />
		</div>
	);
};
