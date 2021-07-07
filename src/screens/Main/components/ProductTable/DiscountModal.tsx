import { Divider, message, Modal, Spin } from 'antd';
import cn from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import FieldError from '../../../../components/elements/FieldError/FieldError';
import { EMPTY_CELL } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { numberWithCommas } from '../../../../utils/function';
import { DiscountForm } from './DiscountForm';
import './style.scss';

interface Props {
	branchProduct: any;
	visible: boolean;
	onClose: any;
}

export const DiscountModal = ({ branchProduct, visible, onClose }: Props) => {
	// STATES
	const [isCustomFieldsVisible, setIsCustomFieldsVisible] = useState(false);

	// REFS
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const discountRef = useRef(null);
	const btnSubmitRef = useRef(null);

	// CUSTOM HOOKS
	const { validateUser, status: authStatus, errors, reset } = useAuth();
	const { updateTransaction, status } = useTransactions();
	const { transactionId, transactionProducts, editProduct, setCurrentTransaction } =
		useCurrentTransaction();

	// METHODS
	const getInitialPrice = useCallback(() => {
		const { price_per_piece, discount_per_piece } = branchProduct;
		return discount_per_piece > 0 ? price_per_piece + discount_per_piece : price_per_piece;
	}, [branchProduct]);

	const getDiscount = useCallback(
		() => ({
			branchProduct,
			discount1: branchProduct?.discounted_price_per_piece1,
			discount2: branchProduct?.discounted_price_per_piece2,
		}),
		[branchProduct],
	);

	const onSelect = (discount) => {
		const newPricePerPiece = getInitialPrice();
		const newDiscountPerPiece = discount > 0 ? newPricePerPiece - discount : discount;

		const callback = () => {
			if (discount > 0) {
				message.success('Sucessfully applied discount to product.');
			} else {
				message.success('Sucessfully removed discount to product.');
			}

			closeModal();
		};

		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: [
						...transactionProducts
							.filter(
								({ transactionProductId }) =>
									transactionProductId !== branchProduct.transactionProductId,
							)
							.map((item) => ({
								transaction_product_id: item.transactionProductId,
								product_id: item.product.id,
								price_per_piece: item.price_per_piece,
								discount_per_piece: item.discount_per_piece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: branchProduct.transactionProductId,
							product_id: branchProduct.product.productId,
							price_per_piece: discount > 0 ? discount : newPricePerPiece,
							discount_per_piece: newDiscountPerPiece,
							quantity: branchProduct.quantity,
						},
					],
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction });
						callback();
					}
				},
			);
		} else {
			editProduct({
				id: branchProduct.id,
				price_per_piece: discount > 0 ? discount : newPricePerPiece,
				discount_per_piece: newDiscountPerPiece,
			});
			callback();
		}
	};

	const onSetCustomDiscount = (data) => {
		reset();

		validateUser(data, ({ status }) => {
			if (status === request.SUCCESS) {
				onSelect(data.discount);
			}
		});
	};

	const closeModal = () => {
		setIsCustomFieldsVisible(false);
		onClose();
	};

	const onOpenCustomDiscount = () => {
		setIsCustomFieldsVisible((value) => {
			if (!value) {
				setTimeout(() => {
					usernameRef?.current?.focus();
				}, 500);
			}

			return !value;
		});
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (key === 'tab' && isCustomFieldsVisible) {
			let inputRef = null;
			let { activeElement } = document;

			if (activeElement === usernameRef.current) {
				inputRef = passwordRef;
			} else if (activeElement === passwordRef.current) {
				inputRef = discountRef;
			} else if (activeElement === discountRef.current) {
				inputRef = btnSubmitRef;
			} else if (activeElement === btnSubmitRef.current) {
				inputRef = usernameRef;
			}

			inputRef?.current?.focus();
		}

		// No Discount
		if (key === 'f1' && branchProduct?.discount_per_piece > 0) {
			onSelect(0);
			return;
		}

		// Discount 1
		if (key === 'f2' && branchProduct) {
			onSelect(getDiscount()?.discount1);
			return;
		}

		// Discount 2
		if (key === 'f3' && branchProduct) {
			onSelect(getDiscount()?.discount2);
			return;
		}

		// Custom Discount
		if (key === 'f4') {
			onOpenCustomDiscount();
			return;
		}
	};

	return (
		<Modal
			title={`Discount - ${branchProduct?.product?.name}`}
			className="DiscountModal"
			visible={visible}
			footer={null}
			onCancel={closeModal}
			centered
			closable
			destroyOnClose
		>
			<KeyboardEventHandler
				handleKeys={['f1', 'f2', 'f3', 'f4', 'tab']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<Spin size="large" spinning={[status, authStatus].includes(request.REQUESTING)}>
				<button
					className={cn('other-button btn-no-discount spacing', {
						disabled: !(branchProduct?.discount_per_piece > 0),
					})}
					onClick={() => onSelect(0)}
				>
					<span>No Discount</span>
					<span className="shortcut-key position-right text-lg">[F1]</span>
				</button>

				<button
					className={cn('other-button spacing', { disabled: !getDiscount().branchProduct })}
					onClick={() => onSelect(getDiscount()?.discount1)}
				>
					{`₱${numberWithCommas(getDiscount()?.discount1?.toFixed(2) || EMPTY_CELL)}`}
					<span className="shortcut-key position-right text-lg">[F2]</span>
				</button>

				<button
					className={cn('other-button spacing', { disabled: !getDiscount().branchProduct })}
					onClick={() => onSelect(getDiscount()?.discount2)}
				>
					{`₱${numberWithCommas(getDiscount()?.discount2?.toFixed(2) || EMPTY_CELL)}`}
					<span className="shortcut-key position-right text-lg">[F3]</span>
				</button>

				<button className="other-button" onClick={onOpenCustomDiscount}>
					Custom
					<span className="shortcut-key position-right text-lg">[F4]</span>
				</button>

				{isCustomFieldsVisible && (
					<>
						<Divider dashed />

						{!!errors.length && errors.map((error) => <FieldError error={error} />)}
						<DiscountForm
							minQuantity={Number(branchProduct?.product?.cost_per_piece) || 0}
							maxQuantity={getInitialPrice()}
							onSubmit={onSetCustomDiscount}
							usernameRef={usernameRef}
							passwordRef={passwordRef}
							discountRef={discountRef}
							btnSubmitRef={btnSubmitRef}
						/>
					</>
				)}
			</Spin>
		</Modal>
	);
};
