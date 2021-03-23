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
	const { previousChange, orNumber } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		setBarcodeScanningEnabled(!visible);
	}, [visible]);

	const handleKeyPress = (key, event) => {
		if (key === 'enter') {
			onClose();
		} else if (key === 'f1') {
			onViewInvoice();
		}
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
			destroyOnClose
		>
			<KeyboardEventHandler
				handleKeys={['enter', 'f1']}
				onKeyEvent={handleKeyPress}
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
							<span className="label">Current Change: </span>
							<span className="value">
								{previousChange !== null
									? `₱${numberWithCommas(previousChange?.toFixed(2))}`
									: EMPTY_CELL}
							</span>
						</div>
					</div>,
					<Button
						text={
							<>
								<span>VIEW OR</span>
								<span className="shortcut-key">[F1]</span>
							</>
						}
						variant="primary"
						size="lg"
						onClick={onViewInvoice}
					/>,
				]}
			/>
		</Modal>
	);
};
