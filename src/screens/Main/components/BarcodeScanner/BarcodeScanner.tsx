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
	const { getTransaction, updateTransaction } = useTransactions();

	// METHODS
	const addBarcodeProduct = (
		branchProduct,
		quantity,
		pricePerPiece = undefined,
		discountPerPiece = undefined,
	) => {
		setLoading(true);

		const callback = () => {
			setLoading(false);
			message.success(`${branchProduct.product.name} sucessfully added.`);
		};

		const productPricePerPiece = pricePerPiece || branchProduct.price_per_piece;

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
							price_per_piece: productPricePerPiece,
							quantity,
							discount_per_piece: discountPerPiece,
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
					pricePerPiece: productPricePerPiece,
					quantity,
					discountPerPiece,
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

	const addTransactionProducts = (products) => {
		products.forEach((item) => {
			const branchProduct = branchProducts.find(
				({ product }) => product?.barcode === item?.product?.barcode,
			);

			const existingProduct = transactionProducts.find(
				(product) => product.id === branchProduct.id,
			);
			if (existingProduct) {
				message.warning(`${branchProduct.product.name} is already in the list.`);
				return;
			}

			if (branchProduct) {
				addBarcodeProduct(
					branchProduct,
					Number(item.quantity),
					Number(item.price_per_piece),
					Number(item.discount_per_piece),
				);
			}
		});
	};

	const scanWeighing = (data) => {
		const barcode = data.substr(0, 7);
		const scannedBarcode = barcode?.toLowerCase() || '';

		return branchProducts.find(({ product }) => product?.barcode === scannedBarcode);
	};

	const scanNonWeighing = (data) => {
		return branchProducts.find(({ product }) => product?.barcode === data);
	};

	const addOrEditScannedProduct = (branchProduct, quantity) => {
		const existingProduct = transactionProducts.find((product) => product.id === branchProduct.id);

		if (existingProduct) {
			editBarcodeProduct(branchProduct, existingProduct, quantity);
		} else {
			addBarcodeProduct(branchProduct, quantity);
		}
	};

	const handleScan = (barcodeNumber) => {
		const data = `${barcodeNumber}`;
		let branchProduct = null;

		message.info(`Scanned Barcode: ${barcodeNumber}`);

		// Scan weighing
		branchProduct = scanWeighing(data);
		if (branchProduct) {
			const value = data.substr(-5);
			const whole = value.substr(0, 2);
			const decimal = value.substr(2, 3);
			const quantity = Number(`${whole}.${decimal}`);
			addOrEditScannedProduct(branchProduct, quantity);

			return;
		}

		// Scan non-weighing
		branchProduct = scanNonWeighing(data);
		if (branchProduct) {
			addOrEditScannedProduct(branchProduct, 1);

			return;
		}

		// Check if transaction and scan
		getTransaction(data.split('_')?.[1], ({ status, transaction }) => {
			if (status === request.SUCCESS) {
				addTransactionProducts(transaction?.products || []);
			} else if (status === request.ERROR) {
				message.error(`Cannot find the scanned product: ${data}`);
			}
		});
	};

	const handleError = (err) => console.error(err);

	return barcodeScanningEnabled ? (
		<BarcodeReader onError={handleError} onScan={handleScan} />
	) : null;
};
