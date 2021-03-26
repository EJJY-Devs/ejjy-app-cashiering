/* eslint-disable react-hooks/exhaustive-deps */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EMPTY_CELL } from '../../../../global/constants';
import {
	cashCollectionShortcutKeys,
	discountAmountShortcutKeys,
	endSessionShortcutKeys,
	othersShortcutKeys,
	queueResumeShortcutKeys,
	resetShortcutKeys,
	voidShortcutKeys,
} from '../../../../global/options';
import { request, transactionStatusTypes } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import { getKeyDownCombination, showErrorMessages } from '../../../../utils/function';
import { DiscountAmountModal } from './DiscountAmountModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { MainButton } from './MainButton';
import { OthersModal } from './OthersModal';
import { QueueModal } from './QueueModal';
import './style.scss';
import { VoidAuthModal } from './VoidAuthModal';

interface Props {
	onCashCollection: any;
	onEndSession: any;
}

export const MainButtons = ({ onCashCollection, onEndSession }: Props) => {
	// STATES
	const [othersModalVisible, setOthersModalVisible] = useState(false);
	const [queueModalVisible, setQueueModalVisible] = useState(false);
	const [keyboardShortcutsModalVisible, setKeyboardShortcutsModalVisible] = useState(false);
	const [discountAmountModalVisible, setDiscountAmountModalVisible] = useState(false);
	const [resetModalVisible, setResetModalVisible] = useState(false);
	const [voidModalVisible, setVoidModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { session } = useSession();
	const {
		transactionId,
		transactionStatus,
		transactionProducts,
		previousVoidedTransactionId,
		transactionStatus: currentTransactionStatus,
		isTransactionSearched,
		resetTransaction,
	} = useCurrentTransaction();
	const { voidTransaction, cancelVoidedTransaction } = useTransactions();
	const {
		mainLoading,
		isModalVisible,
		setModalVisible,
		setMainLoading,
		setMainLoadingText,
	} = useUI();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		setModalVisible(
			othersModalVisible ||
				queueModalVisible ||
				keyboardShortcutsModalVisible ||
				discountAmountModalVisible ||
				resetModalVisible ||
				voidModalVisible,
		);
	}, [
		othersModalVisible,
		queueModalVisible,
		keyboardShortcutsModalVisible,
		discountAmountModalVisible,
		resetModalVisible,
		voidModalVisible,
	]);

	const isVoidDisabled = useCallback(
		() => currentTransactionStatus !== transactionStatusTypes.FULLY_PAID,
		[currentTransactionStatus],
	);

	const isResetDisabled = useCallback(() => !transactionProducts?.length, [transactionProducts]);

	const isDiscountDisabled = useCallback(
		() =>
			[
				transactionStatusTypes.FULLY_PAID,
				transactionStatusTypes.VOID_CANCELLED,
				transactionStatusTypes.VOID_EDITED,
			].includes(currentTransactionStatus),
		[currentTransactionStatus],
	);

	const isQueueDisabled = useCallback(() => transactionStatus !== null, [transactionStatus]);

	const onCashCollectionModified = () => {
		onCashCollection();
		setOthersModalVisible(false);
	};

	const onEndSessionModified = () => {
		onEndSession();
		setOthersModalVisible(false);
	};

	const onResetConfirmation = () => {
		setResetModalVisible(true);

		Modal.confirm({
			title: 'Reset Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: 'Are you sure you want to reset the transaction?',
			okText: 'Reset',
			cancelText: 'Cancel',
			onCancel: () => setResetModalVisible(false),
			onOk: onReset,
		});
	};

	const onReset = () => {
		setResetModalVisible(false);

		if (previousVoidedTransactionId) {
			setMainLoading(true);
			setMainLoadingText('Cancelling voided transaction...');

			const products = transactionProducts.map((product) => ({
				product_id: product.productId,
				quantity: product.quantity,
				price_per_piece: product.pricePerPiece,
			}));

			cancelVoidedTransaction(
				{
					branchId: session?.branch_machine?.branch_id,
					transactionId: previousVoidedTransactionId,
					status: transactionStatusTypes.VOID_CANCELLED,
					products,
				},
				({ status, errors }) => {
					if (status === request.ERROR) {
						message.error(errors);
					}

					setMainLoading(false);
					setMainLoadingText(null);
					resetTransaction();
				},
			);
		} else {
			resetTransaction();
		}
	};

	const onVoid = (formData) => {
		setMainLoading(true);
		setMainLoadingText('Setting transaction to void...');

		voidTransaction({ ...formData, transactionId }, ({ status, errors }) => {
			if (status === request.ERROR) {
				showErrorMessages(errors);
			}

			if (status === request.SUCCESS) {
				setVoidModalVisible(false);
			}

			if ([request.ERROR, request.SUCCESS].includes(status)) {
				setMainLoading(false);
				setMainLoadingText(null);
			}
		});
	};

	const onSetDiscountAmount = () => {
		if (transactionProducts.length === 0) {
			message.error('Please add a product first.');
			return;
		}

		setDiscountAmountModalVisible(true);
	};

	const onKeyboardShortcuts = () => {
		setKeyboardShortcutsModalVisible(true);
		setOthersModalVisible(false);
	};

	const handleKeyDown = (event) => {
		if (isModalVisible) {
			return;
		}

		const key = getKeyDownCombination(event);

		// Queue and Resume
		if (queueResumeShortcutKeys.includes(key)) {
			setQueueModalVisible(true);
			return;
		}

		// Others
		if (othersShortcutKeys.includes(key)) {
			setOthersModalVisible(true);
			return;
		}

		// End Session
		if (endSessionShortcutKeys.includes(key)) {
			onEndSessionModified();
			return;
		}

		// Cash Collection
		if (cashCollectionShortcutKeys.includes(key)) {
			onCashCollectionModified();
			return;
		}

		// Void
		if (voidShortcutKeys.includes(key) && !isVoidDisabled()) {
			setVoidModalVisible(true);
			return;
		}

		// Reset
		if (resetShortcutKeys.includes(key) && !isResetDisabled()) {
			onResetConfirmation();
			return;
		}

		// Discount
		if (discountAmountShortcutKeys.includes(key) && !isDiscountDisabled()) {
			onSetDiscountAmount();
			return;
		}
	};

	return (
		<div className="MainButtons">
			<div className="store-info-wrapper">
				<div className="item">
					<p className="label">Branch</p>
					<p className="value">{session?.user?.branch?.name || EMPTY_CELL}</p>
				</div>

				<div className="item">
					<p className="label">Machine</p>
					<p className="value">{session?.branch_machine?.name || EMPTY_CELL}</p>
				</div>
			</div>

			<div className="buttons-wrapper">
				<MainButton
					title={
						<>
							<span>Queue</span>
							<span className="shortcut-key">[F9]</span>
						</>
					}
					onClick={() => setQueueModalVisible(true)}
					disabled={isQueueDisabled()}
					tabIndex={-1}
				/>

				<MainButton
					title={
						<>
							<span>Discount</span>
							<span className="shortcut-key">[CTRL + Z]</span>
						</>
					}
					onClick={onSetDiscountAmount}
					disabled={isDiscountDisabled()}
					tabIndex={-1}
				/>

				<MainButton
					title={
						<>
							<span>Reset</span>
							<span className="shortcut-key">[F12]</span>
						</>
					}
					onClick={onResetConfirmation}
					disabled={isResetDisabled()}
					tabIndex={-1}
				/>

				<MainButton
					title={
						<>
							<span>Void</span>
							<span className="shortcut-key">[F11]</span>
						</>
					}
					onClick={() => setVoidModalVisible(true)}
					disabled={isVoidDisabled()}
					tabIndex={-1}
				/>

				<MainButton
					title={
						<>
							<span>Others</span>
							<span className="shortcut-key">[F1]</span>
						</>
					}
					classNames="btn-others"
					onClick={() => setOthersModalVisible(true)}
					disabled={isTransactionSearched}
					tabIndex={-1}
				/>
			</div>

			<OthersModal
				onKeyboardShortcuts={onKeyboardShortcuts}
				onCashCollection={onCashCollectionModified}
				onEndSession={onEndSessionModified}
				visible={othersModalVisible}
				onClose={() => setOthersModalVisible(false)}
			/>

			<VoidAuthModal
				visible={voidModalVisible}
				isLoading={mainLoading}
				onConfirm={onVoid}
				onClose={() => setOthersModalVisible(false)}
			/>

			<KeyboardShortcutsModal
				visible={keyboardShortcutsModalVisible}
				onClose={() => setKeyboardShortcutsModalVisible(false)}
			/>

			<QueueModal visible={queueModalVisible} onClose={() => setQueueModalVisible(false)} />

			<DiscountAmountModal
				visible={discountAmountModalVisible}
				onClose={() => setDiscountAmountModalVisible(false)}
			/>
		</div>
	);
};
