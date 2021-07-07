/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React from 'react';
import BarcodeReader from 'react-barcode-reader';
import { request, unitOfMeasurementTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useUI } from '../../../../hooks/useUI';

interface Props {
	setLoading: any;
}

export const BarcodeScanner = ({ setLoading }: Props) => {
	// STATES
	const { listBranchProducts } = useBranchProducts();

	// CUSTOM HOOKS
	const { barcodeScanningEnabled } = useUI();
	const { transactionId, transactionProducts, addProduct, editProduct, setCurrentTransaction } =
		useCurrentTransaction();
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
							price_per_piece: item.price_per_piece,
							quantity: item.quantity,
						})),
						{
							product_id: branchProduct.product.id,
							price_per_piece: productPricePerPiece,
							discount_per_piece: discountPerPiece,
							quantity,
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
			// NOTE: Setting of product
			addProduct({
				product: {
					...branchProduct,
					price_per_piece: productPricePerPiece,
					discount_per_piece: discountPerPiece,
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
								price_per_piece: item.price_per_piece,
								quantity: item.quantity,
							})),
						{
							transaction_product_id: existingProduct.transactionProductId,
							product_id: existingProduct.productId,
							price_per_piece: existingProduct.price_per_piece,
							quantity,
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
			editProduct({ id: existingProduct.id, quantity });
			callback();
		}
	};

	const addTransactionProducts = (products) => {
		products.forEach((item) => {
			const existingProduct = transactionProducts.find(
				(product) => product.id === item.branch_product.id,
			);
			if (existingProduct) {
				editBarcodeProduct(item.branch_product, existingProduct, Number(item.quantity));
				return;
			}

			if (item.branch_product) {
				addBarcodeProduct(
					item.branch_product,
					Number(item.quantity),
					Number(item.price_per_piece),
					Number(item.discount_per_piece),
				);
			}
		});
	};

	const addOrEditScannedProduct = (branchProduct, quantity) => {
		const existingProduct = transactionProducts.find(
			(product) => product.id === branchProduct.product.id,
		);

		if (existingProduct) {
			editBarcodeProduct(branchProduct, existingProduct, quantity);
		} else {
			addBarcodeProduct(branchProduct, quantity);
		}
	};

	const handleScan = (barcodeNumber) => {
		const data = `${barcodeNumber}`;
		message.info(`Scanned Barcode: ${barcodeNumber}`);

		// Check if transaction and scan
		if (data.includes('_')) {
			getTransaction(data.split('_')?.[1], ({ status, transaction }) => {
				if (status === request.SUCCESS) {
					addTransactionProducts(transaction?.products || []);
				} else if (status === request.ERROR) {
					message.error(`Cannot find the scanned transaction: ${data}`);
				}
			});

			return;
		}

		// Scan product
		listBranchProducts(
			{ search: data },
			{
				onSuccess: ({ response }) => {
					const branchProduct = response.results?.[0];
					if (branchProduct) {
						let quantity = 1;

						if (branchProduct.product.unit_of_measurement === unitOfMeasurementTypes.WEIGHING) {
							const value = data.substr(-5);
							const whole = value.substr(0, 2);
							const decimal = value.substr(2, 3);
							quantity = Number(`${whole}.${decimal}`);
						}

						addOrEditScannedProduct(branchProduct, quantity);
					} else {
						message.error(`Cannot find the scanned product: ${data}`);
					}
				},
				onError: () => {
					message.error(`Cannot find the scanned product: ${data}`);
				},
			},
		);
	};

	const handleError = (err, msg) => console.error(err, msg);

	return barcodeScanningEnabled ? (
		<BarcodeReader minLength={3} onError={handleError} onScan={handleScan} />
	) : null;
};
