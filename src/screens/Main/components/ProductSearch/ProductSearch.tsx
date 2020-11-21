import { message, Spin } from 'antd';
import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ControlledInput } from '../../../../components/elements';
import { NO_INDEX_SELECTED } from '../../../../global/constants';
import { branchProductStatus } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { getBranchProductStatus, searchProductInfo } from '../../../../utils/function';
import { AddProductModal } from './AddProductModal';
import './style.scss';

const SEARCH_DEBOUNCE_TIME = 300;

export const ProductSearch = () => {
	const { products: transactionProducts } = useCurrentTransaction();
	const { branchProducts } = useBranchProducts();

	const itemRefs = useRef([]);
	const [searchableProducts, setSearchableProducts] = useState([]);
	const [activeIndex, setActiveIndex] = useState(NO_INDEX_SELECTED);
	const [products, setProducts] = useState([]);
	const [searchedKey, setSearchedKey] = useState('');
	const [searchedSpin, setSearchedSpin] = useState(false);
	const [addProductModalVisible, setAddProductModalVisible] = useState(false);

	// Effect: Set list of searchable products
	useEffect(() => {
		const ids = transactionProducts.map((item) => item.id);
		setSearchableProducts(branchProducts.filter((item) => !ids.includes(item.id)));
	}, [transactionProducts, branchProducts]);

	// Effect: Focus active item
	useEffect(() => {
		if (activeIndex !== NO_INDEX_SELECTED) {
			itemRefs.current?.[activeIndex]?.focus();
		}
	}, [activeIndex]);

	const onSearch = (value) => {
		let filteredProducts = [];

		if (value.length) {
			filteredProducts = searchableProducts.filter(({ product }) =>
				searchProductInfo(value, product),
			);
		}

		setProducts(filteredProducts);
		setActiveIndex(NO_INDEX_SELECTED);
		setSearchedSpin(false);
	};

	const onFocus = () => {
		onSearch(searchedKey);
	};

	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	const handleHover = (index) => {
		setActiveIndex(index);
	};

	const handleKeyPress = (key) => {
		if ((key === 'up' || key === 'down') && activeIndex === NO_INDEX_SELECTED) {
			setActiveIndex(0);
			return;
		}

		if (key === 'up') {
			setActiveIndex((value) => (value > 0 ? value - 1 : value));
		}

		if (key === 'down') {
			setActiveIndex((value) => {
				if (products?.length > 0) {
					return value < products.length - 1 ? value + 1 : value;
				}
				return value;
			});
		}

		if (key === 'enter' && activeIndex !== NO_INDEX_SELECTED) {
			onSelectProduct();
		}

		if (key === 'esc') {
			setSearchedKey('');
		}
	};

	const onSelectProduct = () => {
		const product = products?.[activeIndex];

		if (!product) {
			message.error('Please select a product first.');
			return;
		}

		if (product?.product_status === branchProductStatus.OUT_OF_STOCK) {
			message.error('Product is already out of stock.');
			return;
		}

		setAddProductModalVisible(true);
	};

	const onAddProductSuccess = () => {
		setProducts([]);
	};

	return (
		<div className="ProductSearch">
			<KeyboardEventHandler
				handleKeys={['up', 'down', 'enter', 'esc']}
				onKeyEvent={(key, e) => handleKeyPress(key)}
				isDisabled={!products.length}
			>
				<ControlledInput
					classNames="product-search-input"
					value={searchedKey}
					onFocus={onFocus}
					onChange={(value) => {
						setSearchedSpin(true);
						setSearchedKey(value);
						debounceSearchedChange(value);
					}}
					placeholder="Search by name, barcode, textcode or description"
				/>

				{!!searchedKey.length && (
					<div className="product-search-suggestion">
						<Spin size="large" spinning={searchedSpin}>
							{products.map((item, index) => (
								<div
									ref={(el) => (itemRefs.current[index] = el)}
									tabIndex={index}
									key={index}
									className={cn('item', { active: activeIndex === index })}
									onMouseEnter={() => handleHover(index)}
									onClick={onSelectProduct}
								>
									<div className="name-wrapper">
										<p className="product-name">{item?.product?.name}</p>
										<p className="barcode-textcode">
											{item?.product?.barcode || item?.product?.textcode}
										</p>
									</div>

									{getBranchProductStatus(item?.product_status)}
								</div>
							))}
						</Spin>
					</div>
				)}
			</KeyboardEventHandler>

			<AddProductModal
				product={products?.[activeIndex]}
				visible={addProductModalVisible}
				onSuccess={onAddProductSuccess}
				onClose={() => setAddProductModalVisible(false)}
			/>
		</div>
	);
};