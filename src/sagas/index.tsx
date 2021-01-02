import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchMachinesSagas from './branch-machines';
import branchProductsSagas from './branch-products';
import cashBreakdownsSagas from './cash-breakdowns';
import reportsSagas from './reports';
import sessionsSagas from './session';
import siteSettingsSagas from './site-settings';
import transactionsSagas from './transactions';
import transactionsCombinedProductsSagas from './transactions-combined';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchMachinesSagas,
		...branchProductsSagas,
		...cashBreakdownsSagas,
		...reportsSagas,
		...sessionsSagas,
		...siteSettingsSagas,
		...transactionsSagas,
		...transactionsCombinedProductsSagas,
	]);
}
