import { put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/site-settings';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/site-settings';

/* WORKERS */
function* get({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.get, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(
			actions.save({
				type: types.GET_SITE_SETTINGS,
				siteSettings: response.data,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getWatcherSaga = function* getWatcherSaga() {
	yield takeLatest(types.GET_SITE_SETTINGS, get);
};

export default [getWatcherSaga()];
