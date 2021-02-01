import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/branch-products';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useBranchProducts = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branchProducts = useSelector(selectors.selectBranchProducts());
	const listBranchProducts = useActionDispatch(actions.listBranchProducts);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const listBranchProductsRequest = () => {
		setRecentRequest(types.LIST_BRANCH_PRODUCTS);
		listBranchProducts({ callback });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		branchProducts,
		listBranchProducts: listBranchProductsRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
