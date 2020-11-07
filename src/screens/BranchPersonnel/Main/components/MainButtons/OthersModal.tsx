import { Modal } from 'antd';
import React, { useCallback } from 'react';
import { cashBreakdownTypes } from '../../../../../global/types';
import { useCashBreakdown } from '../../../../../hooks/useCashBreakdown';
import cn from 'classnames';

interface Props {
	onMidSession: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

export const OthersModal = ({ onMidSession, onEndSession, visible, onClose }: Props) => {
	const { cashBreakdowns } = useCashBreakdown();

	const hasMidSessionCashBreakdown = useCallback(
		() => cashBreakdowns.some((cbd) => cbd?.type === cashBreakdownTypes.MID_SESSION),
		[cashBreakdowns],
	);

	return (
		<Modal
			title="Others"
			className="OthersModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<button
				className={cn('other-button btn-cash-breakdown', {
					disabled: hasMidSessionCashBreakdown(),
				})}
				onClick={onMidSession}
			>
				Cash Break Down
			</button>

			<button className="other-button btn-end-session" onClick={onEndSession}>
				End Session
			</button>
		</Modal>
	);
};
