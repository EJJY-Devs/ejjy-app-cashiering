/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Modal } from 'antd';
import React from 'react';
import { OthersReports } from './OthersReports';
import { SearchTransaction } from './SearchTransaction';
import './style.scss';

interface Props {
	onKeyboardShortcuts: any;
	onCashCollection: any;
	onEndSession: any;
	visible: boolean;
	onClose: any;
}

export const OthersModal = ({
	onKeyboardShortcuts,
	onCashCollection,
	onEndSession,
	visible,
	onClose,
}: Props) => {
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

			<button className="other-button" onClick={onCashCollection}>
				Cash Collection
			</button>

			<button className="other-button btn-end-session spacing-top" onClick={onEndSession}>
				End Session
			</button>

			<Divider />

			<OthersReports />

			<Divider />

			<button className="other-button" onClick={onKeyboardShortcuts}>
				Keyboard Shortcuts
			</button>
		</Modal>
	);
};
