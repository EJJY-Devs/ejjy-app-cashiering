import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/branch-machines';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchMachines = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branchMachines = useSelector(selectors.selectBranchMachines());

	const getBranchMachines = useActionDispatch(actions.getBranchMachines);
	const getBranchMachine = useActionDispatch(actions.getBranchMachine);
	const registerBranchMachine = useActionDispatch(actions.registerBranchMachine);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getBranchMachineRequest = (data) => {
		setRecentRequest(types.GET_BRANCH_MACHINE);
		getBranchMachine({ ...data, callback });
	};

	const getBranchMachinesRequest = (data = {}) => {
		setRecentRequest(types.GET_BRANCH_MACHINES);
		getBranchMachines({ ...data, callback });
	};

	const registerBranchMachineRequest = (data, extraCallback = null) => {
		setRecentRequest(types.REGISTER_BRANCH_MACHINE);
		registerBranchMachine({ ...data, callback: modifiedExtraCallback(callback, extraCallback) });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		branchMachines,
		getBranchMachines: getBranchMachinesRequest,
		getBranchMachine: getBranchMachineRequest,
		registerBranchMachine: registerBranchMachineRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
