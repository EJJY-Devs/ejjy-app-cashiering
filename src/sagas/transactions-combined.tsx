import { call, put, retry, takeLatest } from 'redux-saga/effects';
import {
	actions as branchProductActions,
	types as branchProductTypes,
} from '../ducks/branch-products';
import { actions as currentTransactionActions } from '../ducks/current-transaction';
import { types } from '../ducks/transactions';
import { BRANCH_PRODUCTS_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service as branchProductService } from '../services/branch-products';
import { service } from '../services/transactions';

/* WORKERS */
function* firstTimePayment({ payload }: any) {
	const { branchMachineId, tellerId, client, previousVoidedTransactionId, products } = payload;
	const { amountTendered, cashierUserId } = payload;
	const { callback, shouldUpdateBranchProducts = true } = payload;

	callback({ status: request.REQUESTING });

	try {
		const createResponse = yield call(service.create, {
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
			client,
			previous_voided_transaction_id: previousVoidedTransactionId,
			products,
		});

		const response = yield call(service.pay, {
			transaction_id: createResponse.data.id,
			amount_tendered: amountTendered,
			cashier_user_id: cashierUserId,
		});

		yield put(currentTransactionActions.updateTransaction({ transaction: response.data }));

		if (shouldUpdateBranchProducts) {
			const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, branchProductService.list, {
				page: 1,
				page_size: BRANCH_PRODUCTS_PAGE_SIZE,
			});

			yield put(
				branchProductActions.save({
					type: branchProductTypes.LIST_BRANCH_PRODUCTS,
					branchProducts: response.data.results,
				}),
			);
		}

		callback({ status: request.SUCCESS, transaction: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* cancelVoidedTransaction({ payload }: any) {
	const { transactionId, status, products } = payload;
	const { callback, shouldUpdateBranchProducts = true } = payload;

	callback({ status: request.REQUESTING });

	try {
		yield call(service.update, transactionId, {
			products,
			status,
		});

		if (shouldUpdateBranchProducts) {
			const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, branchProductService.list, {
				page: 1,
				page_size: BRANCH_PRODUCTS_PAGE_SIZE,
			});

			yield put(
				branchProductActions.save({
					type: branchProductTypes.LIST_BRANCH_PRODUCTS,
					branchProducts: response.data.results,
				}),
			);
		}

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const firstTimePaymentWatcherSaga = function* firstTimePaymentWatcherSaga() {
	yield takeLatest(types.FIRST_TIME_PAYMENT, firstTimePayment);
};

const cancelVoidedWatcherSaga = function* cancelVoidedWatcherSaga() {
	yield takeLatest(types.CANCEL_VOIDED_TRANSACTION, cancelVoidedTransaction);
};

export default [firstTimePaymentWatcherSaga(), cancelVoidedWatcherSaga()];
