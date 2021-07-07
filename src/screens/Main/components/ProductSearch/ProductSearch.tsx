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
import { branchProductStatus, request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useUI } from '../../../../hooks/useUI';
import { getBranchProductStatus, getKeyDownCombination } from '../../../../utils/function';
import { AddProductModal } from './AddProductModal';
import './style.scss';

const SEARCH_DEBOUNCE_TIME = 500;
const PRODUCT_LIST_HEIGHT = 450;

export const ProductSearch = () => {
	// STATES
	const [activeIndex, setActiveIndex] = useState(NO_INDEX_SELECTED);
	const [branchProducts, setBranchProducts] = useState([]);
	const [searchedKey, setSearchedKey] = useState('');
	const [addProductModalVisible, setAddProductModalVisible] = useState(false);
	const [productIdsInTable, setProductIdsInTable] = useState([]);

	// REFS
	const itemRefs = useRef([]);
	const inputRef = useRef(null);
	const scrollbarRef = useRef(null);

	// CUSTOM HOOKS
	const { listBranchProducts, status } = useBranchProducts();
	const { transactionProducts, isTransactionSearched } = useCurrentTransaction();
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

	useEffect(() => {
		setProductIdsInTable(transactionProducts.map((item) => item.product.id));
	}, [transactionProducts]);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 500);
		}
	}, [inputRef]);

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

	const onSearch = (search) => {
		listBranchProducts(
			{ search },
			{
				onSuccess: ({ response }) => {
					const searchableProducts = response.results.filter(
						({ product }) => !productIdsInTable.includes(product.id),
					);

					setActiveIndex(0);
					setBranchProducts(searchableProducts);
					setSearchSuggestionVisible(searchableProducts.length > 0);
				},
				onError: () => {
					message.warning('Code not recognized.');
				},
			},
		);
	};

	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME),
		[productIdsInTable],
	);

	const isProductSearchDisabled = useCallback(() => isTransactionSearched, [isTransactionSearched]);

	const onSelectProduct = () => {
		const branchProduct = branchProducts?.[activeIndex];

		if (status === request.REQUESTING) {
			message.error("Please wait as we're still searching for products.");
			return;
		}

		if (!branchProduct) {
			message.error('Please select a product first.');
			return;
		}

		if (branchProduct?.product_status === branchProductStatus.OUT_OF_STOCK) {
			message.error('Product is already out of stock.');
			return;
		}

		setAddProductModalVisible(true);
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
				setSearchSuggestionVisible(false);
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
				if (branchProducts?.length > 0) {
					return value < branchProducts.length - 1 ? value + 1 : value;
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
				isDisabled={!branchProducts.length}
			>
				<ControlledInput
					ref={inputRef}
					classNames="product-search-input"
					value={searchedKey}
					onFocus={() => {
						
						onSearch(searchedKey);
					}}
					onChange={(value) => {
						setBranchProducts([]);
						setSearchedKey(value);
						debounceSearchedChange(value);
					}}
					placeholder={
						isProductSearchDisabled() ? '' : 'Search by name, barcode, textcode or description'
					}
					disabled={isProductSearchDisabled()}
				/>

				{searchedKey.length > 0 && (
					<div className="product-search-suggestion">
						<Spin size="large" spinning={status === request.REQUESTING}>
							<Scrollbars
								ref={scrollbarRef}
								autoHeight
								autoHeightMin="100%"
								autoHeightMax={PRODUCT_LIST_HEIGHT}
								style={{ height: '100%', paddingBottom: 10 }}
							>
								{branchProducts.map((item, index) => (
									<div
										ref={(el) => (itemRefs.current[index] = el)}
										key={index}
										className={cn('item', { active: activeIndex === index })}
										onMouseEnter={() => (index) => {
											setActiveIndex(index);
										}}
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
				branchProduct={branchProducts?.[activeIndex]}
				visible={addProductModalVisible}
				onSuccess={() => {
					setSearchedKey('');
					setBranchProducts([]);
					setSearchSuggestionVisible(false);
				}}
				onClose={() => setAddProductModalVisible(false)}
			/>
		</div>
	);
};
