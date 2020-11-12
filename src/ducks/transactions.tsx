import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'TRANSACTIONS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_TRANSACTIONS: `${key}/LIST_TRANSACTIONS`,
	HOLD_TRANSACTION: `${key}/HOLD_TRANSACTION`,
	PAY_TRANSACTION: `${key}/PAY_TRANSACTION`,
	UPDATE_TRANSACTION: `${key}/UPDATE_TRANSACTION`,
	CREATE_TRANSACTION: `${key}/CREATE_TRANSACTION`,

	// Combined
	FIRST_TIME_PAYMENT: `${key}/FIRST_TIME_PAYMENT`,
};

const initialState = {
	transactions: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.LIST_TRANSACTIONS: {
					newData = { transactions: payload.transactions };
					break;
				}

				case types.CREATE_TRANSACTION: {
					newData = { transactions: [...state.transactions, payload.transaction] };
					break;
				}
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	listTransactions: createAction(types.LIST_TRANSACTIONS),
	holdTransaction: createAction(types.HOLD_TRANSACTION),
	payTransaction: createAction(types.PAY_TRANSACTION),
	updateTransaction: createAction(types.UPDATE_TRANSACTION),
	createTransaction: createAction(types.CREATE_TRANSACTION),

	firstTimePayment: createAction(types.FIRST_TIME_PAYMENT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectTransactions: () => createSelector(selectState, (state) => state.transactions),
};

export default reducer;
