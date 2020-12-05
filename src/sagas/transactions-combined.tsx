import { call, put, retry, takeLatest } from 'redux-saga/effects';
import {
	actions as branchProductActions,
	types as branchProductTypes,
} from '../ducks/branch-products';
import { actions as currentTransactionActions } from '../ducks/current-transaction';
import { types } from '../ducks/transactions';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service as branchProductService } from '../services/branch-products';
import { service } from '../services/transactions';

/* WORKERS */
function* firstTimePayment({ payload }: any) {
	const {
		branchMachineId,
		tellerId,
		dummyClientId,
		previousVoidedTransactionId,
		products,
	} = payload;
	const { amountTendered } = payload;
	const { callback, branchId = null, shouldUpdateBranchProducts = true } = payload;

	callback({ status: request.REQUESTING });

	try {
		const createResponse = yield call(service.create, {
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
			dummy_client_id: dummyClientId,
			previous_voided_transaction_id: previousVoidedTransactionId,
			products,
		});

		const response = yield call(service.pay, {
			transaction_id: createResponse.data.id,
			amount_tendered: amountTendered,
		});

		yield put(currentTransactionActions.updateTransaction({ transaction: response.data }));

		if (shouldUpdateBranchProducts && branchId) {
			const response = yield retry(
				MAX_RETRY,
				RETRY_INTERVAL_MS,
				branchProductService.listByBranch,
				{
					page: 1,
					page_size: MAX_PAGE_SIZE,
					branch_id: branchId,
					fields: 'id,product,price_per_piece,product_status',
				},
			);

			yield put(
				branchProductActions.save({
					type: branchProductTypes.LIST_BRANCH_PRODUCTS,
					branchProducts: response.data,
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
	const { callback, branchId = null, shouldUpdateBranchProducts = true } = payload;

	callback({ status: request.REQUESTING });

	try {
		yield call(service.update, transactionId, {
			products,
			status,
		});

		if (shouldUpdateBranchProducts && branchId) {
			const response = yield retry(
				MAX_RETRY,
				RETRY_INTERVAL_MS,
				branchProductService.listByBranch,
				{
					page: 1,
					page_size: MAX_PAGE_SIZE,
					branch_id: branchId,
					fields: 'id,product,price_per_piece,product_status',
				},
			);

			yield put(
				branchProductActions.save({
					type: branchProductTypes.LIST_BRANCH_PRODUCTS,
					branchProducts: response.data,
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
