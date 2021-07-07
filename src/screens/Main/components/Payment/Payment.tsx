/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../../components/elements';
import { printSalesInvoice } from '../../../../configurePrinter';
import { tenderShortcutKeys } from '../../../../global/options';
import { transactionStatusTypes } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useUI } from '../../../../hooks/useUI';
import { getKeyDownCombination, numberWithCommas } from '../../../../utils/function';
import { InvoiceModal } from './InvoiceModal';
import { PaymentModal } from './PaymentModal';
import './style.scss';
import { ThankYouModal } from './ThankYouModal';

export const Payment = () => {
	// STATES
	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [thankYouModalVisible, setThankYouModalVisible] = useState(false);
	const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
	const [transaction, setTransaction] = useState(null);

	// CUSTOM HOOKS
	const {
		transactionProducts,
		transactionStatus,
		previousChange,
		overallDiscount,
		isTransactionSearched,
		resetTransaction,
	} = useCurrentTransaction();
	const { isModalVisible, setModalVisible } = useUI();

	//METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		setModalVisible(paymentModalVisible || thankYouModalVisible || invoiceModalVisible);
	}, [invoiceModalVisible, paymentModalVisible, thankYouModalVisible]);

	const getTotal = useCallback(
		() =>
			Number(
				Object.values(transactionProducts).reduce(
					(prev: number, { quantity, price_per_piece }) => quantity * price_per_piece + prev,
					0,
				),
			),
		[transactionProducts],
	);

	const isPaymentDisabled = useCallback(() => {
		const isSearchedVoidedTransaction =
			isTransactionSearched &&
			[transactionStatusTypes.VOID_EDITED, transactionStatusTypes.VOID_CANCELLED].includes(
				transactionStatus,
			);

		const isFullyPaidTransaction = [
			transactionStatusTypes.FULLY_PAID,
			transactionStatusTypes.VOID_EDITED,
		].includes(transactionStatus);

		return isFullyPaidTransaction || isSearchedVoidedTransaction;
	}, [transactionStatus, isTransactionSearched]);

	const onPaymentSuccess = (transaction) => {
		setPaymentModalVisible(false);
		setThankYouModalVisible(true);
		setTransaction(transaction);
		printSalesInvoice(transaction, transactionProducts, previousChange);
	};

	const onPay = () => {
		if (transactionProducts.length === 0) {
			message.error('Please add a product first.');
			return;
		}

		setPaymentModalVisible(true);
	};

	const handleKeyDown = (event) => {
		if (isModalVisible) {
			return;
		}

		const key = getKeyDownCombination(event);

		// Tender
		if (tenderShortcutKeys.includes(key) && !isPaymentDisabled()) {
			onPay();
			return;
		}
	};

	return (
		<div className="Payment">
			<div className="payment-content">
				<div className="text-wrapper">
					<p className="label">
						Total
						{overallDiscount > 0 && (
							<span className="original-price">
								{`₱${numberWithCommas(getTotal()?.toFixed(2))}`}
							</span>
						)}
					</p>
					<p className="value">{`₱${numberWithCommas(
						(overallDiscount > 0 ? getTotal() - overallDiscount : getTotal())?.toFixed(2),
					)}`}</p>
				</div>
				<Button
					classNames="btn-pay"
					text={
						<>
							<span>Advance</span>
							<span className="shortcut-key">[F8]</span>
						</>
					}
					size="lg"
					variant="primary"
					onClick={onPay}
					disabled={isPaymentDisabled()}
					tabIndex={-1}
					hasShortcutKey
				/>
			</div>
			<div className="pending-balance-wrapper">
				<p className="label">Pending Balance</p>
				<p className="value">{`₱100.00`}</p>
			</div>

			<PaymentModal
				amountDue={overallDiscount > 0 ? getTotal() - overallDiscount : getTotal()}
				visible={paymentModalVisible}
				onSuccess={onPaymentSuccess}
				onClose={() => setPaymentModalVisible(false)}
			/>

			<InvoiceModal
				visible={invoiceModalVisible}
				transaction={transaction}
				onClose={() => setInvoiceModalVisible(false)}
			/>

			<ThankYouModal
				onViewInvoice={() => {
					if (transaction) {
						setInvoiceModalVisible(true);
					}
				}}
				visible={thankYouModalVisible}
				onClose={() => {
					resetTransaction();
					setThankYouModalVisible(false);
				}}
			/>
		</div>
	);
};
