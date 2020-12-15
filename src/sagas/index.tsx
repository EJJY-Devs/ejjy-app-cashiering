import { all } from 'redux-saga/effects';
import branchMachinesSagas from './branch-machines';
import branchProductsSagas from './branch-products';
import cashBreakdownsSagas from './cash-breakdowns';
import sessionsSagas from './session';
import transactionsSagas from './transactions';
import transactionsCombinedProductsSagas from './transactions-combined';
import reportsSagas from './reports';

export default function* rootSaga() {
	yield all([
		...branchMachinesSagas,
		...branchProductsSagas,
		...cashBreakdownsSagas,
		...reportsSagas,
		...sessionsSagas,
		...transactionsSagas,
		...transactionsCombinedProductsSagas,
	]);
}
