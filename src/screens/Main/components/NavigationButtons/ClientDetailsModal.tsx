/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { ClientDetailsForm } from './ClientDetailsForm';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const ClientDetailsModal = ({ visible, onClose }: Props) => {
	// REFS
	const nameRef = useRef(null);
	const addressRef = useRef(null);
	const tinRef = useRef(null);

	// CUSTOM HOOKS
	const { setClient } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		if (visible && nameRef && nameRef.current) {
			setTimeout(() => {
				nameRef.current?.focus();
			}, 500);
		}
	}, [visible, nameRef]);

	const onSubmit = (data) => {
		setClient(data);
		onClose();
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (key === 'tab') {
			let inputRef = null;
			let { activeElement } = document;

			if (activeElement === nameRef.current) {
				inputRef = addressRef;
			} else if (activeElement === addressRef.current) {
				inputRef = tinRef;
			} else if (activeElement === tinRef.current) {
				inputRef = nameRef;
			}

			inputRef?.current?.focus();
		}
	};

	return (
		<Modal
			title="Client Details"
			className="ClientDetailsModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<KeyboardEventHandler
				handleKeys={['f1', 'f2', 'f3', 'f4', 'tab']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<ClientDetailsForm
				nameRef={nameRef}
				addressRef={addressRef}
				tinRef={tinRef}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
