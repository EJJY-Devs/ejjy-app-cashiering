import { useState } from 'react';
import { actions } from '../ducks/branch-products';
import { request } from '../global/types';
import { onCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchProducts = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	const listBranchProductsAction = useActionDispatch(actions.listBranchProducts);

	const requestCallback = ({ status: requestStatus, errors: requestErrors = [] }) => {
		setStatus(requestStatus);
		setErrors(requestErrors);
	};

	const executeRequest = (data, callback, action) => {
		action({
			...data,
			callback: onCallback(requestCallback, callback?.onSuccess, callback?.onError),
		});
	};

	const listBranchProducts = (data, callback = {}) => {
		executeRequest(data, callback, listBranchProductsAction);
	};

	return {
		listBranchProducts,
		status,
		errors,
	};
};
