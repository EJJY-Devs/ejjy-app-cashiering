/* eslint-disable react-hooks/exhaustive-deps */
import { message, Spin } from 'antd';
import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ControlledInput } from '../../../../components/elements';
import { NO_INDEX_SELECTED } from '../../../../global/constants';
import { searchShortcutKeys } from '../../../../global/options';
import { branchProductStatus, transactionStatusTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import {
	getBranchProductStatus,
	getKeyDownCombination,
	searchProductInfo,
} from '../../../../utils/function';
import { AddProductModal } from './AddProductModal';
import './style.scss';
import { useUI } from '../../../../hooks/useUI';

const SEARCH_DEBOUNCE_TIME = 500;
const PRODUCT_LIST_HEIGHT = 450;

export const ProductSearch = () => {
	// STATES
	const [searchableProducts, setSearchableProducts] = useState([]);
	const [activeIndex, setActiveIndex] = useState(NO_INDEX_SELECTED);
	const [products, setProducts] = useState([]);
	const [searchedKey, setSearchedKey] = useState('');
	const [searchedSpin, setSearchedSpin] = useState(false);
	const [addProductModalVisible, setAddProductModalVisible] = useState(false);

	// REFS
	const itemRefs = useRef([]);
	const inputRef = useRef(null);
	const scrollbarRef = useRef(null);

	// CUSTOM HOOKS
	const { branchProducts } = useBranchProducts();
	const { transactionProducts, isTransactionSearched, transactionStatus } = useCurrentTransaction();
	const { isModalVisible, setModalVisible, setSearchSuggestionVisible } = useUI();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		setModalVisible(addProductModalVisible);
	}, [addProductModalVisible]);

	// Effect: Set list of searchable products
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 500);
		}
	}, [inputRef]);

	useEffect(() => {
		const ids = transactionProducts.map((item) => item.id);
		setSearchableProducts(branchProducts.filter((item) => !ids.includes(item.id)));
	}, [transactionProducts, branchProducts]);

	// Effect: Focus active item
	useEffect(() => {
		if (activeIndex !== NO_INDEX_SELECTED) {
			const scrollTop = itemRefs.current?.[activeIndex]?.offsetTop || 0;

			if (scrollTop > PRODUCT_LIST_HEIGHT) {
				scrollbarRef.current?.scrollTop(scrollTop);
			} else {
				scrollbarRef.current?.scrollTop(0);
			}
		}
	}, [activeIndex, scrollbarRef]);

	const onSearch = (value, searchableProducts) => {
		let filteredProducts = [];

		if (value.length) {
			filteredProducts = searchableProducts.filter(({ product }) =>
				searchProductInfo(value, product),
			);
		}

		if (value.length && !filteredProducts.length) {
			message.warning('Code not recognized.');
		}

		setProducts(filteredProducts);
		setActiveIndex(0);
		setSearchedSpin(false);

		setSearchSuggestionVisible(!!filteredProducts.length);
	};

	const onFocus = () => {
		onSearch(searchedKey, searchableProducts);
	};

	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword, searchableProducts), SEARCH_DEBOUNCE_TIME),
		[searchableProducts],
	);

	const isProductSearchDisabled = useCallback(
		() =>
			isTransactionSearched &&
			[transactionStatusTypes.VOID_EDITED, transactionStatusTypes.VOID_CANCELLED].includes(
				transactionStatus,
			),
		[isTransactionSearched, transactionStatus],
	);

	const handleHover = (index) => {
		setActiveIndex(index);
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
		setSearchedKey('');
		setProducts([]);
		setSearchSuggestionVisible(false);
	};

	const handleKeyDown = (event) => {
		if (isModalVisible) {
			return;
		}

		const key = getKeyDownCombination(event);

		if (searchShortcutKeys.includes(key)) {
			if (inputRef?.current !== document.activeElement) {
				inputRef?.current?.focus();
			} else {
				inputRef?.current?.blur();
				setSearchedKey('');
			}
		}
	};

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

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

	return (
		<div className="ProductSearch">
			<KeyboardEventHandler
				handleKeys={['up', 'down', 'enter', 'esc']}
				onKeyEvent={handleKeyPress}
				isDisabled={!products.length}
			>
				<ControlledInput
					ref={inputRef}
					classNames="product-search-input"
					value={searchedKey}
					onFocus={onFocus}
					onChange={(value) => {
						setSearchedSpin(true);
						setSearchedKey(value);
						debounceSearchedChange(value);
					}}
					placeholder="Search by name, barcode, textcode or description"
					disabled={isProductSearchDisabled()}
				/>

				{!!searchedKey.length && (
					<div className="product-search-suggestion">
						<Spin size="large" spinning={searchedSpin}>
							<Scrollbars
								ref={scrollbarRef}
								autoHeight
								autoHeightMin="100%"
								autoHeightMax={PRODUCT_LIST_HEIGHT}
								style={{ height: '100%', paddingBottom: 10 }}
							>
								{products.map((item, index) => (
									<div
										ref={(el) => (itemRefs.current[index] = el)}
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
							</Scrollbars>
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
