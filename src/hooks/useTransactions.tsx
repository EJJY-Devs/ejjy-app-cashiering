import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/transactions';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useTransactions = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const transactions = useSelector(selectors.selectTransactions());

	const listTransactions = useActionDispatch(actions.listTransactions);
	const createTransaction = useActionDispatch(actions.createTransaction);
	const firstTimePayment = useActionDispatch(actions.firstTimePayment);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const listTransactionsRequest = (branchId, extraCallback = null) => {
		setRecentRequest(types.LIST_TRANSACTIONS);

		listTransactions({
			branchId,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createTransactionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_TRANSACTION);

		createTransaction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const firstTimePaymentRequest = (data, extraCallback = null) => {
		setRecentRequest(types.FIRST_TIME_PAYMENT);

		firstTimePayment({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		transactions,
		listTransactions: listTransactionsRequest,
		createTransaction: createTransactionRequest,
		firstTimePayment: firstTimePaymentRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
