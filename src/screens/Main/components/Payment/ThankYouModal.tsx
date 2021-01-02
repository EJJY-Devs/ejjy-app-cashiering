import { Modal, Result } from 'antd';
import React from 'react';
import { printSalesInvoice } from '../../../../configurePrinter';
import { EMPTY_CELL } from '../../../../global/constants';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSiteSettings } from '../../../../hooks/useSiteSettings';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	visible: boolean;
	transaction: any;
	onClose: any;
}

export const ThankYouModal = ({ visible, transaction, onClose }: Props) => {
	// CUSTOM HOOKS
	const { siteSettings } = useSiteSettings();
	const { transactionProducts, previousSukli, orNumber } = useCurrentTransaction();

	// METHODS
	const onPrint = () => {
		printSalesInvoice(transaction, transactionProducts, previousSukli);
	};

	return (
		<Modal
			title=""
			className="ThankYouModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Result
				status="success"
				title={siteSettings?.thank_you_message || 'Thank you for shopping!'}
				subTitle={`Please wait a moment as we are printing your receipt...`}
				extra={[
					<div className="transaction-details">
						<div className="item">
							<span className="label">Invoice Number: </span>
							<span className="value">{orNumber}</span>
						</div>

						<div className="item">
							<span className="label">Previous Sukli: </span>
							<span className="value">
								{previousSukli !== null
									? `₱${numberWithCommas(previousSukli?.toFixed(2))}`
									: EMPTY_CELL}
							</span>
						</div>
					</div>,
				]}
			/>
		</Modal>
	);
};
