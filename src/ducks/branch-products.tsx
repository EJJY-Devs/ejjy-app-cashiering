import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'BRANCH_PRODUCTS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_BRANCH_PRODUCTS: `${key}/LIST_BRANCH_PRODUCTS`,
};

const initialState = {
	branchProducts: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.LIST_BRANCH_PRODUCTS: {
					newData = { branchProducts: payload.branchProducts };
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
	listBranchProducts: createAction(types.LIST_BRANCH_PRODUCTS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectBranchProducts: () => createSelector(selectState, (state) => state.branchProducts),
};

export default reducer;
