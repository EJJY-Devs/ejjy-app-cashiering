import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'AUTH';

export const types = {
	SAVE: `${key}/SAVE`,
};

const initialState = {
	accessToken: null,
	refreshToken: null,
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
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectAccessToken: () => createSelector(selectState, (state) => state.accessToken),
	selectRefreshToken: () => createSelector(selectState, (state) => state.refreshToken),
};

export default reducer;
