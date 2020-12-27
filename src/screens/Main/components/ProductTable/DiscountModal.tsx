import { Divider, message, Modal, Spin } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { EMPTY_CELL } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { numberWithCommas } from '../../../../utils/function';
import { DiscountForm } from './DiscountForm';
import './style.scss';
import { useAuth } from '../../../../hooks/useAuth';
import FieldError from '../../../../components/elements/FieldError/FieldError';

interface Props {
	product: any;
	visible: boolean;
	onClose: any;
}

export const DiscountModal = ({ product, visible, onClose }: Props) => {
	const { branchProducts } = useBranchProducts();
	const { validateUser, status: authStatus, errors, reset } = useAuth();
	const { updateTransaction, status } = useTransactions();
	const {
		transactionId,
		transactionProducts,
		editProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();

	const [isCustomFieldsVisible, setIsCustomFieldsVisible] = useState(false);

	const getInitialPrice = useCallback(() => {
		const { pricePerPiece, discountPerPiece } = product;
		return discountPerPiece > 0 ? pricePerPiece + discountPerPiece : pricePerPiece;
	}, [product]);

	const getDiscount = useCallback(() => {
		const branchProduct = branchProducts.find(({ id }) => id === product?.id);
		return {
			branchProduct,
			discount1: branchProduct?.discounted_price_per_piece1,
			discount2: branchProduct?.discounted_price_per_piece2,
		};
	}, [branchProducts, product]);

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
								({ transactionProductId }) => transactionProductId !== product.transactionProductId,
							)
							.map((item) => ({
								transaction_product_id: item.transactionProductId,
								product_id: item.productId,
								price_per_piece: item.pricePerPiece,
								discount_per_piece: item.discountPerPiece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: product.transactionProductId,
							product_id: product.productId,
							price_per_piece: discount > 0 ? discount : newPricePerPiece,
							discount_per_piece: newDiscountPerPiece,
							quantity: product.quantity,
						},
					],
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction, branchProducts });
						callback();
					}
				},
			);
		} else {
			editProduct({
				id: product.id,
				pricePerPiece: discount > 0 ? discount : newPricePerPiece,
				discountPerPiece: newDiscountPerPiece,
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

	return (
		<Modal
			title={`Discount - ${product?.productName}`}
			className="DiscountModal"
			visible={visible}
			footer={null}
			onCancel={closeModal}
			centered
			closable
		>
			<Spin size="large" spinning={[status, authStatus].includes(request.REQUESTING)}>
				<button
					className={cn('other-button btn-no-discount spacing', {
						disabled: !(product?.discountPerPiece > 0),
					})}
					onClick={() => onSelect(0)}
				>
					No Discount
				</button>

				<button
					className={cn('other-button spacing', { disabled: !getDiscount().branchProduct })}
					onClick={() => onSelect(getDiscount()?.discount1)}
				>
					{`₱${numberWithCommas(getDiscount()?.discount1?.toFixed(2) || EMPTY_CELL)}`}
				</button>

				<button
					className={cn('other-button spacing', { disabled: !getDiscount().branchProduct })}
					onClick={() => onSelect(getDiscount()?.discount2)}
				>
					{`₱${numberWithCommas(getDiscount()?.discount2?.toFixed(2) || EMPTY_CELL)}`}
				</button>

				<button
					className="other-button"
					onClick={() => setIsCustomFieldsVisible((value) => !value)}
				>
					Custom
				</button>

				<Divider dashed />

				{isCustomFieldsVisible && (
					<>
						{!!errors.length && errors.map((error) => <FieldError error={error} />)}
						<DiscountForm maxQuantity={getInitialPrice()} onSubmit={onSetCustomDiscount} />
					</>
				)}
			</Spin>
		</Modal>
	);
};
