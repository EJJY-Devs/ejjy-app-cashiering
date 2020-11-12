import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { STORAGE_KEY } from '../configureStore';
import history from '../utils/history';
import branchProductsReducer, { key as BRANCH_PRODUCTS_KEY } from './branch-products';
import cashBreakdownsReducer, { key as CASH_BREAKDOWN_KEY } from './cash-breakdowns';
import currentTransactionReducer, { key as CURRENT_TRANSACTION_KEY } from './current-transaction';
import requestReducer, { REQUEST_KEY } from './request';
import sessionsReducer, { key as SESSION_KEY, types } from './sessions';
import transactionsReducer, { key as TRANSACTIONS_KEY } from './transactions';
import uiReducer, { key as UI_KEY } from './ui';

const appReducer = combineReducers({
	router: connectRouter(history),
	[CASH_BREAKDOWN_KEY]: cashBreakdownsReducer,
	[SESSION_KEY]: sessionsReducer,
	[REQUEST_KEY]: requestReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[CURRENT_TRANSACTION_KEY]: currentTransactionReducer,
	[TRANSACTIONS_KEY]: transactionsReducer,
	[UI_KEY]: uiReducer,
});

const RESET_TYPES = [types.INVALID_SESSION, types.END_SESSION];
export default (state, action) => {
	if (RESET_TYPES.includes(action.type)) {
		storage.removeItem(STORAGE_KEY);
		state = undefined;
	}
	return appReducer(state, action);
};
