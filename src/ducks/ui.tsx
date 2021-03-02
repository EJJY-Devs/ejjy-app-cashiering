import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { NO_INDEX_SELECTED } from '../global/constants';

export const key = 'USER_INTEFACE';

export const types = {
	SET_TRANSACTION_INDEX: `${key}/SET_TRANSACTION_INDEX`,
	SET_MAIN_LOADING: `${key}/SET_MAIN_LOADING`,
	SET_MAIN_LOADING_TEXT: `${key}/SET_MAIN_LOADING_TEXT`,
	SET_BARCODE_SCANNING_ENABLE: `${key}/SET_BARCODE_SCANNING_ENABLE`,
	SET_SEARCH_SUGGESTION_VISIBLE: `${key}/SET_SEARCH_SUGGESTION_VISIBLE`,
	SET_MODAL_VISIBLE: `${key}/SET_MODAL_VISIBLE`,
};

const initialState = {
	transactionIndex: NO_INDEX_SELECTED,
	mainLoading: false,
	mainLoadingText: null,
	isBarcodeScanningEnabled: true,
	isSearchSuggestionVisible: true,
	isModalVisible: true,
};

const reducer = handleActions(
	{
		[types.SET_TRANSACTION_INDEX]: (state, { payload }: any) => {
			return { ...state, transactionIndex: payload };
		},

		[types.SET_MAIN_LOADING]: (state, { payload }: any) => {
			return { ...state, mainLoading: payload };
		},

		[types.SET_MAIN_LOADING_TEXT]: (state, { payload }: any) => {
			return { ...state, mainLoadingText: payload };
		},

		[types.SET_BARCODE_SCANNING_ENABLE]: (state, { payload }: any) => {
			return { ...state, isBarcodeScanningEnabled: payload };
		},

		[types.SET_SEARCH_SUGGESTION_VISIBLE]: (state, { payload }: any) => {
			return { ...state, isSearchSuggestionVisible: payload };
		},

		[types.SET_MODAL_VISIBLE]: (state, { payload }: any) => {
			return { ...state, isModalVisible: payload };
		},
	},
	initialState,
);

export const actions = {
	setTransactionIndex: createAction(types.SET_TRANSACTION_INDEX),
	setMainLoading: createAction(types.SET_MAIN_LOADING),
	setMainLoadingText: createAction(types.SET_MAIN_LOADING_TEXT),
	setBarcodeScanningEnabled: createAction(types.SET_BARCODE_SCANNING_ENABLE),
	setSearchSuggestionVisible: createAction(types.SET_SEARCH_SUGGESTION_VISIBLE),
	setModalVisible: createAction(types.SET_MODAL_VISIBLE),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectTransactionIndex: () => createSelector(selectState, (state) => state.transactionIndex),
	selectMainLoading: () => createSelector(selectState, (state) => state.mainLoading),
	selectMainLoadingText: () => createSelector(selectState, (state) => state.mainLoadingText),
	selectBarcodeScanningEnabled: () =>
		createSelector(selectState, (state) => state.isBarcodeScanningEnabled),
	selectIsSearchSuggestionVisible: () =>
		createSelector(selectState, (state) => state.isSearchSuggestionVisible),
	selectIsModalVisible: () => createSelector(selectState, (state) => state.isModalVisible),
};

export default reducer;
