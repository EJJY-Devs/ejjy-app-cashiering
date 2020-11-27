/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React from 'react';
import BarcodeReader from 'react-barcode-reader';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';

interface Props {
	setLoading: any;
}

export const BarcodeScanner = ({ setLoading }: Props) => {
	const { branchProducts } = useBranchProducts();
	const {
		products,
		transactionId,
		addProduct,
		editProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();
	const { updateTransaction } = useTransactions();

	const addBarcodeProduct = (branchProduct) => {
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
						...products.map((item) => ({
							transaction_product_id: item.transactionProductId,
							product_id: item.productId,
							quantity: item.quantity,
							price_per_piece: item.pricePerPiece,
						})),
						{
							product_id: branchProduct.product.id,
							price_per_piece: branchProduct.price_per_piece,
							quantity: 1,
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
			addProduct({
				product: {
					id: branchProduct.id,
					productId: branchProduct.product.id,
					productName: branchProduct.product.name,
					productDescription: branchProduct.product.description,
					pricePerPiece: branchProduct.price_per_piece,
					quantity: 1,
				},
			});
			callback();
		}
	};

	const editBarcodeProduct = (branchProduct, existingProduct) => {
		setLoading(true);

		const quantity = existingProduct.quantity + 1;
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
						...products
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
		if (test === '6931717503055') {
			data = '111111';
		}

		const scannedBarcode = data?.toLowerCase() || '';
		const branchProduct = branchProducts.find(({ product }) => product?.barcode === scannedBarcode);

		if (branchProduct) {
			const existingProduct = products.find((product) => product.id);

			if (existingProduct) {
				editBarcodeProduct(branchProduct, existingProduct);
			} else {
				addBarcodeProduct(branchProduct);
			}
		} else {
			message.error(`Cannot find the scanned product: ${data}`);
		}
	};

	const handleError = (err) => console.error(err);

	return <BarcodeReader onError={handleError} onScan={handleScan} />;
};
