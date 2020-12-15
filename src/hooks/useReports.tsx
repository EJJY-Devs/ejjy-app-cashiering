import { useState } from 'react';
import { actions, types } from '../ducks/reports';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useReports = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const createXreadReport = useActionDispatch(actions.createXreadReport);
	const createZreadReport = useActionDispatch(actions.createZreadReport);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const createXreadReportRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_XREAD_REPORT);
		createXreadReport({ ...data, callback: modifiedExtraCallback(callback, extraCallback) });
	};

	const createZreadReportRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_XREAD_REPORT);
		createZreadReport({ ...data, callback: modifiedExtraCallback(callback, extraCallback) });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		createXreadReport: createXreadReportRequest,
		createZreadReport: createZreadReportRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
