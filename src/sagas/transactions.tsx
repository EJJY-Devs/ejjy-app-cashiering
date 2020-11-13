import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/transactions';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/transactions';

/* WORKERS */
function* list({ payload }: any) {
	const { branchId = null, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id: branchId,
		});

		yield put(actions.save({ type: types.LIST_TRANSACTIONS, transactions: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* pay({ payload }: any) {
	const { transactionId, amountTendered, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.pay, {
			transaction_id: transactionId,
			amount_tendered: amountTendered,
		});

		// yield put(
		// 	actions.save({ type: types.PAY_TRANSACTION, cashBreakdowns: response.data.results }),
		// );
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const {
		branchMachineId,
		tellerId,
		dummyClientId,
		products,
		callback,

		// branchId = null,
		// shouldUpdateBranchProducts = true,
	} = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, {
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
			dummy_client_id: dummyClientId,
			products,
		});
		yield put(actions.save({ type: types.CREATE_TRANSACTION, transaction: response.data }));

		// TODO: TEST IF NEEDED PA NI
		// if (shouldUpdateBranchProducts && branchId) {
		// 	const response = yield retry(
		// 		MAX_RETRY,
		// 		RETRY_INTERVAL_MS,
		// 		branchProductService.listByBranch,
		// 		{
		// 			page: 1,
		// 			page_size: MAX_PAGE_SIZE,
		// 			branch_id: branchId,
		// 			fields: 'id,product,price_per_piece,product_status',
		// 		},
		// 	);

		// 	yield put(
		// 		branchProductActions.save({
		// 			type: branchProductTypes.LIST_BRANCH_PRODUCTS,
		// 			branchProducts: response.data,
		// 		}),
		// 	);
		// }

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* update({ payload }: any) {
	const { callback, transactionId, products } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.update, transactionId, { products });
		yield put(actions.save({ type: types.UPDATE_TRANSACTION, transaction: response.data }));

		callback({ status: request.SUCCESS, transaction: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */

const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_TRANSACTIONS, list);
};

const payWatcherSaga = function* payWatcherSaga() {
	yield takeLatest(types.PAY_TRANSACTION, pay);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_TRANSACTION, create);
};

const updateWatcherSaga = function* updateWatcherSaga() {
	yield takeLatest(types.UPDATE_TRANSACTION, update);
};

export default [listWatcherSaga(), payWatcherSaga(), createWatcherSaga(), updateWatcherSaga()];
