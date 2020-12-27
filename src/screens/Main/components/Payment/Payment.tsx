import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Button } from '../../../../components/elements';
import { tenderShortcutKeys } from '../../../../global/options';
import { transactionStatusTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { numberWithCommas } from '../../../../utils/function';
import { InvoiceModal } from './InvoiceModal';
import { PaymentModal } from './PaymentModal';
import './style.scss';

export const Payment = () => {
	const { transactionProducts, transactionStatus } = useCurrentTransaction();
	const { listBranchProducts } = useBranchProducts();
	const { session } = useSession();

	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
	const [transaction, setTransaction] = useState(null);

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

	const isPaymentDisabled = useCallback(
		() =>
			[
				transactionStatusTypes.FULLY_PAID,
				transactionStatusTypes.VOID_CANCELLED,
				transactionStatusTypes.VOID_EDITED,
			].includes(transactionStatus),
		[transactionStatus],
	);

	const onPaymentSuccess = (transaction) => {
		listBranchProducts(session?.user?.branch?.id);
		setInvoiceModalVisible(true);
		setTransaction(transaction);
	};

	const onPay = () => {
		if (transactionProducts.length === 0) {
			message.error('Please add a product first.');
			return;
		}

		setPaymentModalVisible(true);
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		// Tender
		if (tenderShortcutKeys.includes(key) && !isPaymentDisabled()) {
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
					text="Advance"
					size="lg"
					variant="primary"
					onClick={onPay}
					disabled={isPaymentDisabled()}
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

			<InvoiceModal
				visible={invoiceModalVisible}
				transaction={transaction}
				onClose={() => setInvoiceModalVisible(false)}
			/>
		</div>
	);
};
