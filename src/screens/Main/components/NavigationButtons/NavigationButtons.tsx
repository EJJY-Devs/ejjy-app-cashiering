/* eslint-disable react-hooks/exhaustive-deps */
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { ceil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { EditButtonIcon } from '../../../../components';
import { EMPTY_CELL, PRODUCT_LENGTH_PER_PAGE } from '../../../../global/constants';
import { productNavigation } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas } from '../../../../utils/function';
import { ClientDetailsModal } from './ClientDetailsModal';
import { NavigationButton } from './NavigationButton';
import './style.scss';

export const NavigationButtons = () => {
	const {
		transactionId,
		transactionProducts,
		orNumber,
		pageNumber,
		previousSukli,
		client,
		navigateProduct,
	} = useCurrentTransaction();

	const [clientDetailsModalVisible, setClientDetailsModalVisible] = useState(false);

	const getMaxPage = useCallback(() => ceil(transactionProducts.length / PRODUCT_LENGTH_PER_PAGE), [
		transactionProducts,
	]);

	return (
		<div className="NavigationButtons">
			<div className="details">
				<div className="item">
					<p className="label">Client ID:</p>
					<p className="value">
						{client && client?.name && client?.tin ? (
							`${client.name}, ${client.tin}`
						) : (
							<EditButtonIcon
								tooltip="Edit client details"
								onClick={() => setClientDetailsModalVisible(true)}
							/>
						)}
					</p>
				</div>
				<div className="item">
					<p className="label">Transaction No:</p>
					<p className="value">{transactionId || EMPTY_CELL}</p>
				</div>
				<div className="item">
					<p className="label">Invoice No:</p>
					<p className="value">{orNumber || EMPTY_CELL}</p>
				</div>
				<div className="item previous-sukli">
					<p className="label">Previous Sukli:</p>
					<p className="value">
						{previousSukli !== null
							? `₱${numberWithCommas(previousSukli?.toFixed(2))}`
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
