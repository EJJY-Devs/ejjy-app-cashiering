import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'CASHIERING_SESSIONS';

export const types = {
	SAVE: `${key}/SAVE`,
	START_SESSION: `${key}/START_SESSION`,
	END_SESSION: `${key}/END_SESSION`,
	VALIDATE_SESSION: `${key}/VALIDATE_SESSION`,
};

const initialState = {
	session: null,
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
	startSession: createAction(types.START_SESSION),
	endSession: createAction(types.END_SESSION),
	validateSession: createAction(types.VALIDATE_SESSION),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectSession: () => createSelector(selectState, (state) => state.session),
};

export default reducer;
