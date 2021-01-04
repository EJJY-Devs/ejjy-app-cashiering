/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Result } from 'antd';
import React, { useEffect } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Button from '../../../../components/elements/Button/Button';
import { EMPTY_CELL } from '../../../../global/constants';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useSiteSettings } from '../../../../hooks/useSiteSettings';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';
import { useUI } from '../../../../hooks/useUI';

interface Props {
	visible: boolean;
	onViewInvoice: any;
	onClose: any;
}

export const ThankYouModal = ({ visible, onViewInvoice, onClose }: Props) => {
	// CUSTOM HOOKS
	const { setBarcodeScanningEnabled } = useUI();
	const { siteSettings } = useSiteSettings();
	const { previousSukli, orNumber, resetTransaction } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		setBarcodeScanningEnabled(!visible);
	}, [visible]);

	const close = () => {
		resetTransaction();
		onClose();
	};

	return (
		<Modal
			title=""
			className="ThankYouModal"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable
		>
			<KeyboardEventHandler
				handleKeys={['enter']}
				onKeyEvent={(key, e) => {
					if (key === 'enter') {
						close();
					}
				}}
				handleFocusableElements
				isDisabled={!visible}
			/>

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
					<Button text="VIEW OR" variant="primary" size="lg" onClick={onViewInvoice} />,
				]}
			/>
		</Modal>
	);
};
