import React, { useState } from 'react';
import { request } from '../../../../../global/types';
import { useCurrentTransaction } from '../../../../../hooks/useCurrentTransaction';
import { MainButton } from './MainButton';
import { OthersModal } from './OthersModal';
import './style.scss';

interface Props {
	onMidSession: any;
	onEndSession: any;
}

export const MainButtons = ({ onMidSession, onEndSession }: Props) => {
	const {
		transactionId,
		products: transactionProducts,
		createCurrentTransaction,
		resetTransaction,
		status: currentTransactionStatus,
	} = useCurrentTransaction();

	const [othersModalVisible, setOthersModalVisible] = useState(false);

	const onMidSessionModified = () => {
		onMidSession();
		setOthersModalVisible(false);
	};

	const onEndSessionModified = () => {
		onEndSession();
		setOthersModalVisible(false);
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
					disabled={transactionId || !transactionProducts.length}
					onClick={createCurrentTransaction}
					loading={currentTransactionStatus === request.REQUESTING}
				/>

				<MainButton title="Discount" onClick={() => null} />

				<MainButton title="Reset" onClick={resetTransaction} />

				<MainButton title="Void" onClick={() => null} />

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
		</div>
	);
};
