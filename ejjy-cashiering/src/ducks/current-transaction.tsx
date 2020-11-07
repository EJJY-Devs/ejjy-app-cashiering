import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'CURRENT_TRANSACTION';

export const types = {
	ADD_PRODUCT: `${key}/ADD_PRODUCT`,
	REMOVE_PRODUCT: `${key}/REMOVE_PRODUCT`,
};

const initialState = {
	products: [],
};

const reducer = handleActions(
	{
		[types.ADD_PRODUCT]: (state, { payload }: any) => {
			return { ...state, products: [...state.products, payload.product] };
		},

		[types.REMOVE_PRODUCT]: (state, { payload }: any) => {
			console.log([payload]);
			return { ...state, products: state.products.filter(({ id }) => id !== payload.id) };
		},
	},
	initialState,
);

export const actions = {
	addProduct: createAction(types.ADD_PRODUCT),
	removeProduct: createAction(types.REMOVE_PRODUCT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProducts: () => createSelector(selectState, (state) => state.products),
};

export default reducer;
