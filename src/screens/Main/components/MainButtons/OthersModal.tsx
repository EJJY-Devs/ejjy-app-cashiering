/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React from 'react';
import { SearchTransaction } from './SearchTransaction';
import './style.scss';

interface Props {
	onMidSession: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

export const OthersModal = ({ onMidSession, onEndSession, visible, onClose }: Props) => {
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
			<SearchTransaction closeModal={onClose} />

			<button className="other-button btn-cash-breakdown" onClick={onMidSession}>
				Cash Collection
			</button>

			<button className="other-button btn-end-session" onClick={onEndSession}>
				End Session
			</button>
		</Modal>
	);
};
