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
} from '../components';
import { UncontrolledInput } from '../components/elements';
import { MACHINE_COUNT_KEY, MACHINE_ID_KEY, ROW_HEIGHT } from '../global/constants';
import {
	branchProductStatus,
	cashBreakdownTypes,
	request,
	unitOfMeasurementTypes,
	userTypes,
} from '../global/types';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const countDecimals = (value) => {
	if (Math.floor(value) === value) return 0;
	return value.toString().split('.')[1].length || 0;
};

export const getUserTypeDescription = memoize((userType) => {
	switch (userType) {
		case userTypes.ADMIN:
			return 'Admin';
		case userTypes.BRANCH_MANAGER:
			return 'Branch Manager';
		case userTypes.BRANCH_PERSONNEL:
			return 'Branch Personnel';
		case userTypes.OFFICE_MANAGER:
			return 'Office Manager';
	}

	return '';
});

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

export const getBranchMachineId = () => localStorage.getItem(MACHINE_ID_KEY);

export const getBranchMachineCount = () => localStorage.getItem(MACHINE_COUNT_KEY);

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

export const getCashBreakdownTypeDescription = memoize((type) => {
	switch (type) {
		case cashBreakdownTypes.START_SESSION: {
			return 'Cash Breakdown - Start Session';
		}
		case cashBreakdownTypes.MID_SESSION: {
			return 'Cash Collection';
		}
		case cashBreakdownTypes.END_SESSION: {
			return 'Cash Breakdown - End Session';
		}
	}
});

export const getProductQuantity = (quantity, unitOfMeasurementType) => {
	if (unitOfMeasurementType === unitOfMeasurementTypes.WEIGHING) {
		return quantity.toFixed(3);
	} else if (unitOfMeasurementType === unitOfMeasurementTypes.NON_WEIGHING) {
		return quantity.toFixed(0);
	}

	return 0;
};

export const getKeyDownCombination = (keyboardEvent) => {
	let firstKey = '';

	if (keyboardEvent?.altKey) {
		firstKey = 'alt+';
	}

	if (keyboardEvent?.ctrlKey) {
		firstKey = 'ctrl+';
	}

	if (keyboardEvent?.metaKey) {
		firstKey = 'meta+';
	}

	if (keyboardEvent?.shiftKey) {
		firstKey = 'shift+';
	}

	return firstKey + keyboardEvent?.key;
};
