import { call, retry, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branch-machines';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request, userTypes } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { service as authService } from '../services/auth';
import { service } from '../services/branch-machines';

/* WORKERS */
function* list({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* register({ payload }: any) {
	const { login, password, branchMachineId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		let response = yield call(authService.login, { login, password }, ONLINE_API_URL);
		if (response.data.user_type === userTypes.ADMIN) {
			response = yield call(service.register, branchMachineId);
			callback({ status: request.SUCCESS, response: response.data });
		} else {
			callback({
				status: request.ERROR,
				errors: ['Only admin can register a branch machine.'],
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_MACHINES, list);
};

const registerWatcherSaga = function* registerWatcherSaga() {
	yield takeLatest(types.REGISTER_BRANCH_MACHINE, register);
};

export default [listWatcherSaga(), registerWatcherSaga()];
