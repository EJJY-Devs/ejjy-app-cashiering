/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React from 'react';
import { SearchTransaction } from './SearchTransaction';
import './style.scss';

interface Props {
	onCashCollection: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

export const OthersModal = ({ onCashCollection, onEndSession, visible, onClose }: Props) => {
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
			<SearchTransaction visible={visible} closeModal={onClose} />

			<button className="other-button btn-cash-breakdown" onClick={onCashCollection}>
				Cash Collection
			</button>

			<button className="other-button btn-end-session" onClick={onEndSession}>
				End Session
			</button>
		</Modal>
	);
};
