import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { EMPTY_CELL } from '../../../../global/constants';
import {
	cashCollectionShortcutKeys,
	endSessionShortcutKeys,
	holdResumeShortcutKeys,
	othersShortcutKeys,
	resetShortcutKeys,
	voidShortcutKeys,
} from '../../../../global/options';
import { request, transactionStatusTypes } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import { HoldModal } from './HoldModal';
import { MainButton } from './MainButton';
import { OthersModal } from './OthersModal';
import './style.scss';

interface Props {
	onCashCollection: any;
	onEndSession: any;
}

export const MainButtons = ({ onCashCollection, onEndSession }: Props) => {
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

	const [othersModalVisible, setOthersModalVisible] = useState(false);
	const [holdModalVisible, setHoldModalVisible] = useState(false);

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

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		// Hold and Resume
		if (holdResumeShortcutKeys.includes(key)) {
			setHoldModalVisible(true);
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
			onVoid();
			return;
		}

		// Reset
		if (resetShortcutKeys.includes(key) && !isResetDisabled()) {
			onReset();
			return;
		}
	};

	return (
		<div className="MainButtons">
			<KeyboardEventHandler
				handleKeys={[
					...othersShortcutKeys,
					...cashCollectionShortcutKeys,
					...endSessionShortcutKeys,
					...holdResumeShortcutKeys,
					...voidShortcutKeys,
					...resetShortcutKeys,
				]}
				onKeyEvent={(key, e) => handleKeyPress(key, e)}
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
				<MainButton title="Hold" classNames="btn-hold" onClick={() => setHoldModalVisible(true)} />

				<MainButton title="Discount" onClick={() => null} />

				<MainButton title="Reset" onClick={onReset} disabled={isResetDisabled()} />

				<MainButton title="Void" onClick={onVoid} disabled={isVoidDisabled()} />

				<MainButton
					title="Others"
					classNames="btn-others"
					onClick={() => setOthersModalVisible(true)}
				/>
			</div>

			<OthersModal
				onCashCollection={onCashCollectionModified}
				onEndSession={onEndSessionModified}
				visible={othersModalVisible}
				onClose={() => setOthersModalVisible(false)}
			/>

			<HoldModal visible={holdModalVisible} onClose={() => setHoldModalVisible(false)} />
		</div>
	);
};
