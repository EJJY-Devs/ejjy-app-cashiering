import { call, put, takeLatest } from 'redux-saga/effects';
import { actions as authActions } from '../ducks/auth';
import { types } from '../ducks/reports';
import { request, userTypes } from '../global/types';
import { service as authService } from '../services/auth';
import { service as reportsService } from '../services/reports';

/* WORKERS */
function* createXreadReport({ payload }: any) {
	const { login, password, branchMachineId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const loginResponse = yield call(authService.login, { login, password }, null);

		if (loginResponse.data.user_type === userTypes.BRANCH_MANAGER) {
			const tokenResponse = yield call(authService.acquireToken, {
				username: login,
				password,
			});

			yield put(
				authActions.save({
					user: loginResponse.data,
					accessToken: tokenResponse.data.access,
					refreshToken: tokenResponse.data.refresh,
				}),
			);

			const reportResponse = yield call(reportsService.createXread, {
				branch_machine_id: branchMachineId,
				user_id: loginResponse.data.id,
			});

			callback({ status: request.SUCCESS, response: reportResponse.data });
		} else {
			callback({
				status: request.ERROR,
				errors: 'Only the branch manager can generate a report.',
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createZreadReport({ payload }: any) {
	const { login, password, branchMachineId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const loginResponse = yield call(authService.login, { login, password }, null);

		if (loginResponse.data.user_type === userTypes.BRANCH_MANAGER) {
			const tokenResponse = yield call(authService.acquireToken, {
				username: login,
				password,
			});

			yield put(
				authActions.save({
					user: loginResponse.data,
					accessToken: tokenResponse.data.access,
					refreshToken: tokenResponse.data.refresh,
				}),
			);

			const reportResponse = yield call(reportsService.createZread, {
				branch_machine_id: branchMachineId,
				user_id: loginResponse.data.id,
			});

			callback({ status: request.SUCCESS, response: reportResponse.data });
		} else {
			callback({
				status: request.ERROR,
				errors: 'Only the branch manager can generate a report.',
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const createXreadReportWatcherSaga = function* createXreadReportWatcherSaga() {
	yield takeLatest(types.CREATE_XREAD_REPORT, createXreadReport);
};

const createZreadReportWatcherSaga = function* createZreadReportWatcherSaga() {
	yield takeLatest(types.CREATE_ZREAD_REPORT, createZreadReport);
};

export default [createXreadReportWatcherSaga(), createZreadReportWatcherSaga()];
