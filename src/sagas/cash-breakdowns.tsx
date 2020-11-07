import { call, put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/cash-breakdowns';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/cash-breakdowns';

/* WORKERS */
function* list({ payload }: any) {
	const { cashieringSessionId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			cashiering_session_id: cashieringSessionId,
		});

		yield put(
			actions.save({ type: types.LIST_CASH_BREAKDOWNS, cashBreakdowns: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, data);

		yield put(actions.save({ type: types.CREATE_CASH_BREAKDOWN, cashBreakdown: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_CASH_BREAKDOWNS, list);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_CASH_BREAKDOWN, create);
};

export default [listWatcherSaga(), createWatcherSaga()];
