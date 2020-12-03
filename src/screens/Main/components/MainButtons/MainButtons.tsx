import React, { useState } from 'react';
import { request, transactionStatus } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSession } from '../../../../hooks/useSession';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';
import { MainButton } from './MainButton';
import { OthersModal } from './OthersModal';
import { HoldModal } from './HoldModal';
import './style.scss';

interface Props {
	onMidSession: any;
	onEndSession: any;
}

export const MainButtons = ({ onMidSession, onEndSession }: Props) => {
	const { session } = useSession();
	const {
		transactionId,
		isFullyPaid,
		transactionStatus: transStatus,
		products: transactionProducts,
		setCurrentTransaction,
		resetTransaction,
	} = useCurrentTransaction();
	const { voidTransaction } = useTransactions();
	const { branchProducts } = useBranchProducts();
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
		resetTransaction();
	};

	const onVoid = () => {
		setMainLoading(true);
		setMainLoadingText('Setting transaction to void...');

		const products = transactionProducts.map((product) => ({
			product_id: product.productId,
			quantity: product.quantity,
			price_per_piece: product.pricePerPiece,
		}));

		const data = {
			branchId: session?.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user.id,
			dummyClientId: 1, // TODO: Update on next sprint
			products,
			transactionId,
		};

		voidTransaction(data, ({ status, transaction }) => {
			if (status === request.SUCCESS) {
				setMainLoading(false);
				setMainLoadingText(null);
				setCurrentTransaction({ transaction, branchProducts });
			}
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
				<MainButton title="Hold" classNames="btn-hold" onClick={() => setHoldModalVisible(true)} />

				<MainButton title="Discount" onClick={() => null} />

				<MainButton title="Reset" onClick={onReset} />

				<MainButton
					title="Void"
					onClick={onVoid}
					disabled={!isFullyPaid || transStatus === transactionStatus.VOID}
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
