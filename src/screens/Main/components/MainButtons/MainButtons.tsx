import { message } from 'antd';
import React, { useState } from 'react';
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
	onMidSession: any;
	onEndSession: any;
}

export const MainButtons = ({ onMidSession, onEndSession }: Props) => {
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

	const onMidSessionModified = () => {
		onMidSession();
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

			setMainLoading(false);
			setMainLoadingText(null);
		});
	};

	return (
		<div className="MainButtons">
			<div className="store-info-wrapper">
				<div className="item">
					<p className="label">Branch</p>
					<p className="value">Branch Name</p>
				</div>

				<div className="item">
					<p className="label">Machine</p>
					<p className="value">Machine Name</p>
				</div>
			</div>

			<div className="buttons-wrapper">
				<MainButton
					title="Hold"
					classNames="btn-hold"
					onClick={() => setHoldModalVisible(true)}
					disabled={currentTransactionStatus === transactionStatusTypes.VOID}
				/>

				<MainButton title="Discount" onClick={() => null} />

				<MainButton title="Reset" onClick={onReset} />

				<MainButton
					title="Void"
					onClick={onVoid}
					disabled={currentTransactionStatus !== transactionStatusTypes.FULLY_PAID}
				/>

				<MainButton
					title="Others"
					classNames="btn-others"
					onClick={() => setOthersModalVisible(true)}
				/>
			</div>

			<OthersModal
				onMidSession={onMidSessionModified}
				onEndSession={onEndSessionModified}
				visible={othersModalVisible}
				onClose={() => setOthersModalVisible(false)}
			/>

			<HoldModal visible={holdModalVisible} onClose={() => setHoldModalVisible(false)} />
		</div>
	);
};
