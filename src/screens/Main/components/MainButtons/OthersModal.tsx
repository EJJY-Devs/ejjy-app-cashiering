/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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
	// REFS
	const inputRef = useRef(null);

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (key === 'f1') {
			onKeyboardShortcuts();
		} else if (key === 'f11') {
			onCashCollection();
		} else if (key === 'f12') {
			onEndSession();
		}
	};

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
			<KeyboardEventHandler
				handleKeys={['f1', 'f11', 'f12']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<SearchTransaction inputRef={inputRef} visible={visible} closeModal={onClose} />

			<button className="other-button" onClick={onCashCollection}>
				Cash Collection
				<span className="shortcut-key position-right text-lg">[F11]</span>
			</button>

			<button className="other-button btn-end-session spacing-top" onClick={onEndSession}>
				End Session
				<span className="shortcut-key position-right text-lg">[F12]</span>
			</button>

			<Divider />

			<OthersReports visible={visible} />

			<Divider />

			<button className="other-button" onClick={onKeyboardShortcuts}>
				Keyboard Shortcuts
				<span className="shortcut-key position-right text-lg">[F1]</span>
			</button>
		</Modal>
	);
};
