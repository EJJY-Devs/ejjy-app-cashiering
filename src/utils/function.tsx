import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import { floor, memoize } from 'lodash';
import React from 'react';
import {
	AvailableBadgePill,
	ColoredText,
	coloredTextType,
	OutOfStocksBadgePill,
	ReorderBadgePill,
	ROW_HEIGHT,
} from '../components';
import { UncontrolledInput } from '../components/elements';
import { branchProductStatus, request } from '../global/types';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const calculateTableHeight = (listLength) => {
	const MAX_ROW_COUNT = 6;
	return ROW_HEIGHT * (listLength <= MAX_ROW_COUNT ? listLength : MAX_ROW_COUNT);
};

export const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const removeCommas = (x) => {
	return x?.toString()?.replace(/,/g, '') || '';
};

export const showMessage = (status, successMessage, errorMessage) => {
	if (status === request.SUCCESS) {
		message.success(successMessage);
	} else if (status === request.ERROR) {
		message.error(errorMessage);
	}
};

interface ConfirmPassword {
	title?: string;
	label?: string;
	onSuccess: any;
}
export const confirmPassword = ({ title = 'Input Password', onSuccess }: ConfirmPassword) => {
	let password = '';

	Modal.confirm({
		title,
		centered: true,
		className: 'ConfirmPassword',
		okText: 'Submit',
		content: <UncontrolledInput type="password" onChange={(value) => (password = value)} />,
		onOk: (close) => {
			if (password === 'generic123') {
				onSuccess();
				close();
			} else {
				message.error('Incorrect password.');
			}
		},
	});
};

export const formatDateTime = memoize((datetime) => dayjs(datetime).format('MM/DD/YYYY h:mma'));

export const formatDateTimeExtended = memoize((datetime) =>
	dayjs(datetime).format('MMMM D, YYYY h:mma'),
);

export const formatDate = memoize((date) => dayjs(date).format('MM/DD/YYYY'));

export const convertToBulk = (pieces, piecesInBulk) => floor(pieces / piecesInBulk);

export const convertToPieces = (bulk, piecesInBulk) => bulk * piecesInBulk;

export const modifiedCallback = (callback, successMessage, errorMessage, extraCallback = null) => {
	return (response) => {
		showMessage(response?.status, successMessage, errorMessage);
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};
};

export const modifiedExtraCallback = (callback, extraCallback = null) => {
	return (response) => {
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};
};

export const getColoredText = memoize((key, isDefault, x, y, isOverOnlyIfDefault = false) => {
	let text = `${x}/${y}`;

	if (isDefault) {
		text = isOverOnlyIfDefault ? text : y;
		return <ColoredText type={coloredTextType.DEFAULT} text={text} />;
	} else if (x !== y) {
		return <ColoredText type={coloredTextType.ERROR} text={text} />;
	} else if (x === y) {
		return <ColoredText type={coloredTextType.PRIMARY} text={text} />;
	}

	return null;
});

export const searchProductInfo = (value, product) => {
	const searchedValue = value?.toLowerCase();

	const name = product?.name?.toLowerCase() ?? '';
	const barcode = product?.barcode?.toLowerCase() ?? '';
	const textcode = product?.textcode?.toLowerCase() ?? '';
	const description = product?.description?.toLowerCase() ?? '';

	return (
		name.includes(searchedValue) ||
		barcode.includes(searchedValue) ||
		textcode.includes(searchedValue) ||
		description.includes(searchedValue)
	);
};

export const getBranchProductStatus = memoize((status) => {
	switch (status) {
		case branchProductStatus.AVAILABLE: {
			return <AvailableBadgePill classNames="badge" />;
		}
		case branchProductStatus.REORDER: {
			return <ReorderBadgePill classNames="badge" />;
		}
		case branchProductStatus.OUT_OF_STOCK: {
			return <OutOfStocksBadgePill classNames="badge" />;
		}
	}
});
