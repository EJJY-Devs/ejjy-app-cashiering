import { useState } from 'react';
import { actions, types } from '../ducks/branch-machines';
import { request } from '../global/types';
import { onCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchMachines = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// ACTIONS
	const getBranchMachinesAction = useActionDispatch(actions.getBranchMachines);
	const registerBranchMachineAction = useActionDispatch(actions.registerBranchMachine);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const requestCallback = ({ status: requestStatus, errors: requestErrors = [] }) => {
		setStatus(requestStatus);
		setErrors(requestErrors);
	};

	const executeRequest = (data, callback, action, type) => {
		setRecentRequest(type);
		action({
			...data,
			callback: onCallback(requestCallback, callback?.onSuccess, callback?.onError),
		});
	};

	const getBranchMachines = (callback = {}) => {
		executeRequest({}, callback, getBranchMachinesAction, types.GET_BRANCH_MACHINES);
	};

	const registerBranchMachine = (data, callback = {}) => {
		executeRequest(data, callback, registerBranchMachineAction, types.REGISTER_BRANCH_MACHINE);
	};

	return {
		getBranchMachines,
		registerBranchMachine,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
