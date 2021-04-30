import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, types, selectors } from '../ducks/auth';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useAuth = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const localIpAddress = useSelector(selectors.selectLocalIpAddress());

	const saveAction = useActionDispatch(actions.save);
	const validateUser = useActionDispatch(actions.validateUser);
	const loginBranchManagerAction = useActionDispatch(actions.loginBranchManager);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const validateUserRequest = (data, extraCallback = null) => {
		setRecentRequest(types.VALIDATE_USER);
		validateUser({ ...data, callback: modifiedExtraCallback(callback, extraCallback) });
	};

	const loginBranchManager = (data) => {
		loginBranchManagerAction({ ...data, callback });
	};

	const updateLocalIpAddress = (newLocalIpAddress) => {
		saveAction({ localIpAddress: newLocalIpAddress });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		localIpAddress,
		validateUser: validateUserRequest,
		updateLocalIpAddress,
		loginBranchManager,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
