import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/cash-breakdowns';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useCashBreakdown = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const cashBreakdowns = useSelector(selectors.selectCashBreakdowns());

	const listCashBreakdown = useActionDispatch(actions.listCashBreakdown);
	const createCashBreakdown = useActionDispatch(actions.createCashBreakdown);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const listCashBreakdownRequest = (cashieringSessionId) => {
		setRecentRequest(types.LIST_CASH_BREAKDOWNS);
		listCashBreakdown({ cashieringSessionId, callback });
	};

	const createCashBreakdownRequest = (data) => {
		setRecentRequest(types.CREATE_CASH_BREAKDOWN);
		createCashBreakdown({ ...data, callback });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		cashBreakdowns,
		listCashBreakdown: listCashBreakdownRequest,
		createCashBreakdown: createCashBreakdownRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
