import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Button } from '../../../../components/elements';
import { tenderShortcutKeys } from '../../../../global/options';
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

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		// Tender
		if (tenderShortcutKeys.includes(key) && !isFullyPaid) {
			onPay();
			return;
		}
	};

	return (
		<div className="Payment">
			<KeyboardEventHandler
				handleKeys={tenderShortcutKeys}
				onKeyEvent={(key, e) => handleKeyPress(key, e)}
			/>

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
