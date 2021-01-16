import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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
import { DiscountAmountModal } from './DiscountAmountModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { MainButton } from './MainButton';
import { OthersModal } from './OthersModal';
import { QueueModal } from './QueueModal';
import './style.scss';

interface Props {
	onCashCollection: any;
	onEndSession: any;
}

export const MainButtons = ({ onCashCollection, onEndSession }: Props) => {
	// STATES
	const [othersModalVisible, setOthersModalVisible] = useState(false);
	const [queueModalVisible, setQueueModalVisible] = useState(false);
	const [keyboardShortcutsVisible, setKeyboardShortcutsVisible] = useState(false);
	const [discountAmountVisible, setDiscountAmountVisible] = useState(false);

	// CUSTOM HOOKS
	const { session } = useSession();
	const {
		transactionId,
		transactionProducts,
		previousVoidedTransactionId,
		transactionStatus: currentTransactionStatus,
		resetTransaction,
	} = useCurrentTransaction();
	const { voidTransaction, cancelVoidedTransaction } = useTransactions();
	const { setMainLoading, setMainLoadingText } = useUI();

	// METHODS
	const isVoidDisabled = useCallback(
		() => currentTransactionStatus !== transactionStatusTypes.FULLY_PAID,
		[currentTransactionStatus],
	);

	const isResetDisabled = useCallback(() => !transactionProducts?.length, [transactionProducts]);

	const onCashCollectionModified = () => {
		onCashCollection();
		setOthersModalVisible(false);
	};

	const onEndSessionModified = () => {
		onEndSession();
		setOthersModalVisible(false);
	};

	const onResetConfirmation = () => {
		Modal.confirm({
			title: 'Reset Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: 'Are you sure you want to reset the transaction?',
			okText: 'Reset',
			cancelText: 'Cancel',
			onOk: onReset,
		});
	};

	const onReset = () => {
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

	const onVoidConfirmation = () => {
		Modal.confirm({
			title: 'Void Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: 'Are you sure you want to void the transaction?',
			okText: 'Void',
			cancelText: 'Cancel',
			onOk: onVoid,
		});
	};

	const onVoid = () => {
		setMainLoading(true);
		setMainLoadingText('Setting transaction to void...');

		voidTransaction(transactionId, ({ status, errors }) => {
			if (status === request.ERROR) {
				message.error(errors);
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

		setDiscountAmountVisible(true);
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

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
			onVoidConfirmation();
			return;
		}

		// Reset
		if (resetShortcutKeys.includes(key) && !isResetDisabled()) {
			onResetConfirmation();
			return;
		}

		// Reset
		if (discountAmountShortcutKeys.includes(key)) {
			onSetDiscountAmount();
			return;
		}
	};

	const onKeyboardShortcuts = () => {
		setKeyboardShortcutsVisible(true);
		setOthersModalVisible(false);
	};

	return (
		<div className="MainButtons">
			<KeyboardEventHandler
				handleKeys={[
					...othersShortcutKeys,
					...cashCollectionShortcutKeys,
					...endSessionShortcutKeys,
					...queueResumeShortcutKeys,
					...voidShortcutKeys,
					...resetShortcutKeys,
					...discountAmountShortcutKeys,
				]}
				onKeyEvent={handleKeyPress}
			/>

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
				/>

				<MainButton
					title={
						<>
							<span>Discount</span>
							<span className="shortcut-key">[CTRL + Z]</span>
						</>
					}
					onClick={onSetDiscountAmount}
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
				/>

				<MainButton
					title={
						<>
							<span>Void</span>
							<span className="shortcut-key">[F11]</span>
						</>
					}
					onClick={onVoidConfirmation}
					disabled={isVoidDisabled()}
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
				/>
			</div>

			<OthersModal
				onKeyboardShortcuts={onKeyboardShortcuts}
				onCashCollection={onCashCollectionModified}
				onEndSession={onEndSessionModified}
				visible={othersModalVisible}
				onClose={() => setOthersModalVisible(false)}
			/>

			<KeyboardShortcutsModal
				visible={keyboardShortcutsVisible}
				onClose={() => setKeyboardShortcutsVisible(false)}
			/>

			<QueueModal visible={queueModalVisible} onClose={() => setQueueModalVisible(false)} />

			<DiscountAmountModal
				visible={discountAmountVisible}
				onClose={() => setDiscountAmountVisible(false)}
			/>
		</div>
	);
};
