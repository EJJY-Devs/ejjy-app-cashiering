import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/sessions';
import { request } from '../global/types';
import { service } from '../services/session';

/* WORKERS */
function* startSession({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.startSession, data);

		yield put(actions.save({ type: types.START_SESSION, session: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* endSession({ payload }: any) {
	const { callback, sessionId } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.endSession, sessionId);

		yield put(actions.save({ type: types.END_SESSION, session: response.data }));
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* validateSession({ payload }: any) {
	const { callback, sessionId } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.validateSession, sessionId);

		yield put(actions.save({ type: types.VALIDATE_SESSION, session: response.data }));
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const startSessionWatcherSaga = function* startSessionWatcherSaga() {
	yield takeLatest(types.START_SESSION, startSession);
};

const endSessionWatcherSaga = function* endSessionWatcherSaga() {
	yield takeLatest(types.END_SESSION, endSession);
};

const validateSessionWatcherSaga = function* validateSessionWatcherSaga() {
	yield takeLatest(types.VALIDATE_SESSION, validateSession);
};

export default [startSessionWatcherSaga(), endSessionWatcherSaga(), validateSessionWatcherSaga()];
