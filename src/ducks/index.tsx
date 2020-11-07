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
import uiReducer, { key as UI_KEY } from './ui';

const appReducer = combineReducers({
	router: connectRouter(history),
	[CASH_BREAKDOWN_KEY]: cashBreakdownsReducer,
	[SESSION_KEY]: sessionsReducer,
	[REQUEST_KEY]: requestReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[CURRENT_TRANSACTION_KEY]: currentTransactionReducer,
	[UI_KEY]: uiReducer,
});

export default (state, action) => {
	if (action.type === types.END_SESSION) {
		storage.removeItem(STORAGE_KEY);
		state = undefined;
	}
	return appReducer(state, action);
};
