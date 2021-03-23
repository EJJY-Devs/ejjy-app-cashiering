/* eslint-disable react-hooks/exhaustive-deps */
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { ceil } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { EditButtonIcon } from '../../../../components';
import { EMPTY_CELL, PRODUCT_LENGTH_PER_PAGE } from '../../../../global/constants';
import { editClientShortcutKeys } from '../../../../global/options';
import { productNavigation } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useUI } from '../../../../hooks/useUI';
import { getKeyDownCombination, numberWithCommas } from '../../../../utils/function';
import { ClientDetailsModal } from './ClientDetailsModal';
import { NavigationButton } from './NavigationButton';
import './style.scss';

export const NavigationButtons = () => {
	// STATES
	const [clientDetailsModalVisible, setClientDetailsModalVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		transactionId,
		transactionProducts,
		orNumber,
		pageNumber,
		previousChange,
		client,
		isTransactionSearched,
		navigateProduct,
	} = useCurrentTransaction();
	const { isModalVisible, setModalVisible } = useUI();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		setModalVisible(clientDetailsModalVisible);
	}, [clientDetailsModalVisible]);

	const getMaxPage = useCallback(() => ceil(transactionProducts.length / PRODUCT_LENGTH_PER_PAGE), [
		transactionProducts,
	]);

	const handleKeyDown = (event) => {
		if (isModalVisible) {
			return;
		}

		const key = getKeyDownCombination(event);

		// Edit Client
		if (editClientShortcutKeys.includes(key)) {
			setClientDetailsModalVisible(true);
			return;
		}
	};
	return (
		<div className="NavigationButtons">
			<div className="details">
				<div className="item">
					<p className="label">Client ID:</p>
					{isTransactionSearched ? (
						EMPTY_CELL
					) : (
						<p className="value">
							{client && client?.name && client?.tin ? (
								<div className="client-details-wrapper">
									<span className="client-text">{`${client.name}, ${client.tin}`}</span>
									<EditButtonIcon
										tooltip="Edit client details"
										onClick={() => setClientDetailsModalVisible(true)}
									/>
								</div>
							) : (
								<EditButtonIcon
									tooltip="Edit client details"
									onClick={() => setClientDetailsModalVisible(true)}
								/>
							)}
						</p>
					)}
				</div>
				<div className="item">
					<p className="label">Transaction No:</p>
					<p className="value">{transactionId || EMPTY_CELL}</p>
				</div>
				<div className="item">
					<p className="label">Invoice No:</p>
					<p className="value">{orNumber || EMPTY_CELL}</p>
				</div>
				<div className="item previous-change">
					<p className="label">Previous Change:</p>
					<p className="value">
						{previousChange !== null
							? `₱${numberWithCommas(previousChange?.toFixed(2))}`
							: EMPTY_CELL}
					</p>
				</div>
			</div>
			<div className="buttons">
				<NavigationButton
					classNames="btn-prev"
					icon={<CaretLeftOutlined />}
					onClick={() => navigateProduct(productNavigation.PREV)}
					disabled={pageNumber === 1}
				/>

				<NavigationButton
					classNames="btn-next"
					icon={<CaretRightOutlined />}
					onClick={() => navigateProduct(productNavigation.NEXT)}
					disabled={
						pageNumber === getMaxPage() || transactionProducts.length <= PRODUCT_LENGTH_PER_PAGE
					}
				/>
			</div>

			<ClientDetailsModal
				visible={clientDetailsModalVisible}
				onClose={() => setClientDetailsModalVisible(false)}
			/>
		</div>
	);
};
