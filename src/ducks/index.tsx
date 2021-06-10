import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { APP_KEY } from '../global/constants';
import history from '../utils/history';
import authReducer, { key as AUTH_KEY } from './auth';
import branchProductsReducer, { key as BRANCH_PRODUCTS_KEY } from './branch-products';
import cashBreakdownsReducer, { key as CASH_BREAKDOWN_KEY } from './cash-breakdowns';
import currentTransactionReducer, { key as CURRENT_TRANSACTION_KEY } from './current-transaction';
import requestReducer, { REQUEST_KEY } from './request';
import sessionsReducer, { key as SESSION_KEY, types } from './sessions';
import siteSettingsReducer, { key as SITE_SETTINGS_KEY } from './site-settings';
import transactionsReducer, { key as TRANSACTIONS_KEY } from './transactions';
import uiReducer, { key as UI_KEY } from './ui';

const appReducer = combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[CASH_BREAKDOWN_KEY]: cashBreakdownsReducer,
	[SESSION_KEY]: sessionsReducer,
	[REQUEST_KEY]: requestReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[CURRENT_TRANSACTION_KEY]: currentTransactionReducer,
	[SITE_SETTINGS_KEY]: siteSettingsReducer,
	[TRANSACTIONS_KEY]: transactionsReducer,
	[UI_KEY]: uiReducer,
});

const RESET_TYPES = [types.INVALID_SESSION, types.END_SESSION];
export default (state, action) => {
	if (RESET_TYPES.includes(action.type)) {
		const newValue = { [AUTH_KEY]: state[AUTH_KEY] };
		storage.setItem(APP_KEY, JSON.stringify(newValue));

		state = newValue;
	}

	return appReducer(state, action);
};
