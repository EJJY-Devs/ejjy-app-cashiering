import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/cash-breakdowns';
import { cashBreakdownTypes, request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

const CREATE_SUCCESS_MESSAGE = 'Cash breakdown was submitted successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while submitting the cash breakdown';

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

	const createCashBreakdownRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_CASH_BREAKDOWN);
		createCashBreakdown({
			...data,
			callback:
				data?.type === cashBreakdownTypes.MID_SESSION
					? modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE, extraCallback)
					: modifiedExtraCallback(callback, extraCallback),
		});
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
