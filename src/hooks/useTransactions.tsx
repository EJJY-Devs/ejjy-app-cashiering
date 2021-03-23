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
	const getTransaction = useActionDispatch(actions.getTransaction);
	const createTransaction = useActionDispatch(actions.createTransaction);
	const updateTransaction = useActionDispatch(actions.updateTransaction);
	const payTransaction = useActionDispatch(actions.payTransaction);
	const firstTimePayment = useActionDispatch(actions.firstTimePayment);
	const voidTransaction = useActionDispatch(actions.voidTransaction);
	const cancelVoidedTransaction = useActionDispatch(actions.cancelVoidedTransaction);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const listTransactionsRequest = (data, extraCallback = null) => {
		setRecentRequest(types.LIST_TRANSACTIONS);

		listTransactions({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getTransactionRequest = (transactionId, extraCallback = null) => {
		setRecentRequest(types.GET_TRANSACTION);

		getTransaction({
			transactionId,
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

	const updateTransactionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.UPDATE_TRANSACTION);

		updateTransaction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const payTransactionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.PAY_TRANSACTION);

		payTransaction({
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

	const voidTransactionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.VOID_TRANSACTION);

		voidTransaction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const cancelVoidedTransactionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CANCEL_VOIDED_TRANSACTION);

		cancelVoidedTransaction({
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
		getTransaction: getTransactionRequest,
		createTransaction: createTransactionRequest,
		updateTransaction: updateTransactionRequest,
		payTransaction: payTransactionRequest,
		firstTimePayment: firstTimePaymentRequest,
		voidTransaction: voidTransactionRequest,
		cancelVoidedTransaction: cancelVoidedTransactionRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
