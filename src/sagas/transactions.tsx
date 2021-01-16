import { call, put, takeLatest } from 'redux-saga/effects';
import { actions as currentTransactionActions } from '../ducks/current-transaction';
import { actions, types } from '../ducks/transactions';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/transactions';

/* WORKERS */
function* list({ payload }: any) {
	const { status, branchMachineId, tellerId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			status,
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
		});

		yield put(actions.save({ type: types.LIST_TRANSACTIONS, transactions: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* get({ payload }: any) {
	const { transactionId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.get, transactionId);

		callback({ status: request.SUCCESS, transaction: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* pay({ payload }: any) {
	const { transactionId, amountTendered, cashierUserId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.pay, {
			transaction_id: transactionId,
			amount_tendered: amountTendered,
			cashier_user_id: cashierUserId,
		});

		yield put(currentTransactionActions.updateTransaction({ transaction: response.data }));

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		console.table(e);
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const {
		branchMachineId,
		tellerId,
		client,
		products,
		callback,
		overallDiscount = 0,
		status,
	} = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, {
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
			client,
			products,
			overall_discount: overallDiscount,
			status,
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

		callback({ status: request.SUCCESS, response: response.data });
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

function* voidTransaction({ payload }: any) {
	const { callback, transactionId } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.void, transactionId);
		yield put(currentTransactionActions.transactionVoided({ transaction: response.data }));

		callback({ status: request.SUCCESS, transaction: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */

const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_TRANSACTIONS, list);
};

const getWatcherSaga = function* getWatcherSaga() {
	yield takeLatest(types.GET_TRANSACTION, get);
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

const voidWatcherSaga = function* voidWatcherSaga() {
	yield takeLatest(types.VOID_TRANSACTION, voidTransaction);
};

export default [
	listWatcherSaga(),
	getWatcherSaga(),
	payWatcherSaga(),
	createWatcherSaga(),
	updateWatcherSaga(),
	voidWatcherSaga(),
];
