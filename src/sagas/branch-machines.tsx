import { call, put, takeLatest } from 'redux-saga/effects';
import { actions as authActions } from '../ducks/auth';
import { types as branchMachinesTypes } from '../ducks/branch-machines';
import { request, userTypes } from '../global/types';
import { service as authService } from '../services/auth';
import { service as branchMachinesService } from '../services/branch-machines';

/* WORKERS */
function* register({ payload }: any) {
	const { login, password, machineName, machineId, machinePrinterSerialNumber, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const loginResponse = yield call(authService.login, { login, password });

		if (loginResponse.data.user_type === userTypes.ADMIN) {
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

			const branchMachineResponse = yield call(branchMachinesService.create, {
				name: machineName,
				machine_id: machineId,
				machine_printer_serial_number: machinePrinterSerialNumber,
			});

			callback({ status: request.SUCCESS, response: branchMachineResponse.data });
		} else {
			callback({
				status: request.ERROR,
				errors: 'Only admin can register a branch machine.',
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const registerWatcherSaga = function* registerWatcherSaga() {
	yield takeLatest(branchMachinesTypes.REGISTER_BRANCH_MACHINE, register);
};

export default [registerWatcherSaga()];
