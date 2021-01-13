import { message, Modal, Spin } from 'antd';
import React, { useCallback, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import FieldError from '../../../../components/elements/FieldError/FieldError';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { DiscountAmountForm } from './DiscountAmountForm';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const DiscountAmountModal = ({ visible, onClose }: Props) => {
	// REFS
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const discountRef = useRef(null);
	const btnCancelRef = useRef(null);
	const btnSubmitRef = useRef(null);

	// CUSTOM HOOKS
	const { validateUser, status, errors, reset } = useAuth();
	const { transactionProducts, overallDiscount, setDiscount } = useCurrentTransaction();

	// METHODS
	const getTotal = useCallback(
		() =>
			Number(
				Object.values(transactionProducts).reduce(
					(prev: number, { quantity, pricePerPiece }) => quantity * pricePerPiece + prev,
					0,
				),
			),
		[transactionProducts],
	);

	const onSubmit = (data) => {
		reset();

		validateUser(data, ({ status }) => {
			if (status === request.SUCCESS) {
				message.success('Sucessfully applied discount to transaction.');
				setDiscount(data.discount);
				onClose();
			}
		});
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (key === 'tab') {
			let inputRef = null;
			let { activeElement } = document;

			if (activeElement === discountRef.current) {
				inputRef = usernameRef;
			} else if (activeElement === usernameRef.current) {
				inputRef = passwordRef;
			} else if (activeElement === passwordRef.current) {
				inputRef = btnSubmitRef;
			} else if (activeElement === btnSubmitRef.current) {
				inputRef = btnCancelRef;
			} else if (activeElement === btnCancelRef.current) {
				inputRef = discountRef;
			}

			inputRef?.current?.focus();
		}
	};

	return (
		<Modal
			title="Discount Amount"
			className="DiscountAmountModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
			destroyOnClose
		>
			<KeyboardEventHandler
				handleKeys={['tab']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<Spin size="large" spinning={status === request.REQUESTING}>
				{!!errors.length && errors.map((error) => <FieldError error={error} />)}
				<DiscountAmountForm
					currentPrice={getTotal()}
					overallDiscount={overallDiscount}
					usernameRef={usernameRef}
					passwordRef={passwordRef}
					discountRef={discountRef}
					btnCancelRef={btnCancelRef}
					btnSubmitRef={btnSubmitRef}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			</Spin>
		</Modal>
	);
};
