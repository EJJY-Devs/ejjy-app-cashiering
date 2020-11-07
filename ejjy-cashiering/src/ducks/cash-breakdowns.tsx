import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'CASH_BREAKDOWNS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_CASH_BREAKDOWNS: `${key}/LIST_CASH_BREAKDOWNS`,
	CREATE_CASH_BREAKDOWN: `${key}/CREATE_CASH_BREAKDOWN`,
};

const initialState = {
	cashBreakdowns: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	listCashBreakdown: createAction(types.LIST_CASH_BREAKDOWNS),
	createCashBreakdown: createAction(types.CREATE_CASH_BREAKDOWN),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectCashBreakdowns: () => createSelector(selectState, (state) => state.cashBreakdowns),
};

export default reducer;
