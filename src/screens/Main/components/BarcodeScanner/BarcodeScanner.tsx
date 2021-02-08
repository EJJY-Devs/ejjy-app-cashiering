/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React from 'react';
import BarcodeReader from 'react-barcode-reader';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';

interface Props {
	setLoading: any;
}

export const BarcodeScanner = ({ setLoading }: Props) => {
	// STATES
	const { branchProducts } = useBranchProducts();

	// CUSTOM HOOKS
	const { barcodeScanningEnabled } = useUI();
	const {
		transactionId,
		transactionProducts,
		addProduct,
		editProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();
	const { updateTransaction } = useTransactions();

	// METHODS
	const addBarcodeProduct = (branchProduct, quantity) => {
		setLoading(true);

		const callback = () => {
			setLoading(false);
			message.success(`${branchProduct.product.name} sucessfully added.`);
		};

		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: [
						...transactionProducts.map((item) => ({
							transaction_product_id: item.transactionProductId,
							product_id: item.productId,
							quantity: item.quantity,
							price_per_piece: item.pricePerPiece,
						})),
						{
							product_id: branchProduct.product.id,
							price_per_piece: branchProduct.price_per_piece,
							quantity,
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
			// NOTE: Setting of product
			addProduct({
				product: {
					data: branchProduct.product,
					id: branchProduct.id,
					productId: branchProduct.product.id,
					pricePerPiece: branchProduct.price_per_piece,
					quantity,
				},
			});
			callback();
		}
	};

	const editBarcodeProduct = (branchProduct, existingProduct, newQuantity) => {
		setLoading(true);

		const quantity = existingProduct.quantity + newQuantity;
		if (quantity >= branchProduct.current_balance) {
			message.error('Insufficient balance.');
			return;
		}

		const callback = () => {
			setLoading(false);
			message.success(`${branchProduct.product.name} sucessfully edited.`);
		};

		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: [
						...transactionProducts
							.filter(
								({ transactionProductId }) =>
									transactionProductId !== existingProduct.transactionProductId,
							)
							.map((item) => ({
								transaction_product_id: item.transactionProductId,
								product_id: item.productId,
								price_per_piece: item.pricePerPiece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: existingProduct.transactionProductId,
							product_id: existingProduct.productId,
							price_per_piece: existingProduct.pricePerPiece,
							quantity,
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
			editProduct({ id: existingProduct.id, quantity });
			callback();
		}
	};

	const handleScan = (test) => {
		let data = `${test}`;

		const barcode = data.substr(0, 7);
		const value = data.substr(-6);
		const whole = value.substr(0, 2);
		const decimal = value.substr(2, 3);

		message.info(`Barcode: ${barcode} -> Value: ${whole}.${decimal}`);

		const quantity = Number(`${whole}.${decimal}`);
		const scannedBarcode = barcode?.toLowerCase() || '';
		const branchProduct = branchProducts.find(({ product }) => product?.barcode === scannedBarcode);

		if (branchProduct) {
			const existingProduct = transactionProducts.find((product) => product.id);

			if (existingProduct) {
				editBarcodeProduct(branchProduct, existingProduct, quantity);
			} else {
				addBarcodeProduct(branchProduct, quantity);
			}
		} else {
			message.error(`Cannot find the scanned product: ${data}`);
		}
	};

	const handleError = (err) => console.error(err);
	console.log('barcodeScanningEnabled', barcodeScanningEnabled);
	return barcodeScanningEnabled ? (
		<BarcodeReader onError={handleError} onScan={handleScan} />
	) : null;
};
