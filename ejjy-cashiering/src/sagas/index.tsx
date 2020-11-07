import { all } from 'redux-saga/effects';
import cashBreakdownsSagas from './cash-breakdowns';
import sessionsSagas from './session';
import branchProductsSagas from './branch-products';

export default function* rootSaga() {
	yield all([...sessionsSagas, ...cashBreakdownsSagas, ...branchProductsSagas]);
}
