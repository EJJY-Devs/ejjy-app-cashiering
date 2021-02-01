import { call, takeLatest } from 'redux-saga/effects';
import { types as branchMachinesTypes } from '../ducks/auth';
import { request } from '../global/types';
import { LOCAL_API_URL } from '../services';
import { service } from '../services/auth';
import { getUserTypeDescription } from '../utils/function';

/* WORKERS */
function* validateUser({ payload }: any) {
	const { login, password, userType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.login, { login, password }, LOCAL_API_URL);

		if (response.data.user_type === userType) {
			callback({ status: request.SUCCESS });
		} else {
			callback({
				status: request.ERROR,
				errors: [`User is not a ${getUserTypeDescription(userType)}.`],
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const validateUserWatcherSaga = function* validateUserWatcherSaga() {
	yield takeLatest(branchMachinesTypes.VALIDATE_USER, validateUser);
};

export default [validateUserWatcherSaga()];
