import { ceil, cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { PRODUCT_LENGTH_PER_PAGE } from '../global/constants';
import { productNavigation, transactionStatusTypes } from '../global/types';

export const key = 'CURRENT_TRANSACTION';

export const types = {
	ADD_PRODUCT: `${key}/ADD_PRODUCT`,
	REMOVE_PRODUCT: `${key}/REMOVE_PRODUCT`,
	EDIT_PRODUCT: `${key}/EDIT_PRODUCT`,

	SET_CURRENT_TRANSACTION: `${key}/SET_CURRENT_TRANSACTION`,
	UPDATE_TRANSACTION: `${key}/UPDATE_TRANSACTION`,
	RESET_TRANSACTION: `${key}/RESET_TRANSACTION`,

	TRANSACTION_VOIDED: `${key}/TRANSACTION_VOIDED`,

	NAVIGATE_PRODUCT: `${key}/NAVIGATE_PRODUCT`,
	SET_PREVIOUS_SUKLI: `${key}/SET_PREVIOUS_SUKLI`,
};

const initialState = {
	products: [],
	transactionId: null,
	isFullyPaid: false,
	clientId: null,
	totalPaidAmount: 0,
	invoiceId: null,
	orNumber: null,
	status: null,
	previousVoidedTransactionId: null,

	pageNumber: 1,
	previousSukli: null,
};

const reducer = handleActions(
	{
		[types.ADD_PRODUCT]: (state, { payload }: any) => {
			return { ...state, products: [payload.product, ...state.products] };
		},

		[types.REMOVE_PRODUCT]: (state, { payload }: any) => {
			return { ...state, products: state.products.filter(({ id }) => id !== payload.id) };
		},

		[types.EDIT_PRODUCT]: (state, { payload }: any) => {
			const products = cloneDeep(state.products);
			const index = products.findIndex(({ id }) => id === payload.id);

			if (index >= 0) {
				products[index] = {
					...products[index],
					...payload,
				};
			}

			return { ...state, products };
		},

		[types.UPDATE_TRANSACTION]: (state, { payload }: any) => {
			const { transaction } = payload;
			const products = [];

			state.products.forEach((item) => {
				const foundProduct = transaction.products.find(
					({ product }) => product.id === item.productId,
				);

				if (foundProduct) {
					products.push({
						...item,
						transactionProductId: foundProduct.id,
					});
				}
			});

			const newData = {
				transactionId: transaction.id,
				invoiceId: transaction?.invoice.id,
				orNumber: transaction?.invoice.or_number,
				clientId: transaction.client_id,
				isFullyPaid: transaction.is_fully_paid,
				totalPaidAmount: transaction.total_paid_amount,
				status: transaction.status,
				previousVoidedTransactionId: transaction.previous_voided_transaction_id,
				products,
			};

			return { ...state, ...newData };
		},

		[types.SET_CURRENT_TRANSACTION]: (state, { payload }: any) => {
			const { transaction, branchProducts } = payload;

			const products = transaction.products.map((item) => {
				const branchProduct = branchProducts.find(({ product }) => product?.id === item.product.id);

				return {
					transactionProductId: item.id,
					id: branchProduct?.id,
					productId: item.product.id,
					productName: item.product.name,
					productDescription: item.product.description,
					pricePerPiece: Number(item.price_per_piece),
					quantity: item.quantity,
				};
			});

			const newData = {
				transactionId: transaction.id,
				invoiceId: transaction?.invoice?.id,
				orNumber: transaction?.invoice?.or_number,
				clientId: transaction.client_id,
				isFullyPaid: transaction.is_fully_paid,
				totalPaidAmount: transaction.total_paid_amount,
				status: transaction.status,
				// TODO:: CHECK IF WORKING
				previousVoidedTransactionId:
					transaction.status === transactionStatusTypes.VOID_CANCELLED
						? transaction.id
						: transaction.previous_voided_transaction_id,
				products,
				pageNumber: 1,
			};

			return { ...state, ...newData };
		},

		[types.TRANSACTION_VOIDED]: (state, { payload }: any) => {
			const { transaction } = payload;

			const newData = {
				transactionId: null,
				invoiceId: null,
				orNumber: null,
				clientId: null,
				isFullyPaid: false,
				totalPaidAmount: transaction.total_paid_amount,
				status: transaction.status,
				previousVoidedTransactionId: transaction.id,
				pageNumber: 1,
			};

			return { ...state, ...newData };
		},

		[types.RESET_TRANSACTION]: (state) => {
			const { previousSukli, ...initialData } = initialState;
			return { ...state, ...initialData };
		},

		[types.NAVIGATE_PRODUCT]: (state, { payload }: any) => {
			var { pageNumber, products } = state;
			let maxPage = ceil(products.length / PRODUCT_LENGTH_PER_PAGE);

			switch (payload) {
				case productNavigation.PREV: {
					pageNumber = pageNumber > 1 ? pageNumber - 1 : 1;
					break;
				}
				case productNavigation.NEXT: {
					pageNumber = pageNumber < maxPage ? pageNumber + 1 : maxPage;
					break;
				}
				case productNavigation.RESET: {
					pageNumber = 1;
					break;
				}
			}

			return { ...state, pageNumber };
		},

		[types.SET_PREVIOUS_SUKLI]: (state, { payload }: any) => {
			return { ...state, previousSukli: payload };
		},
	},
	initialState,
);

export const actions = {
	addProduct: createAction(types.ADD_PRODUCT),
	removeProduct: createAction(types.REMOVE_PRODUCT),
	editProduct: createAction(types.EDIT_PRODUCT),

	setCurrentTransaction: createAction(types.SET_CURRENT_TRANSACTION),
	updateTransaction: createAction(types.UPDATE_TRANSACTION),
	resetTransaction: createAction(types.RESET_TRANSACTION),

	transactionVoided: createAction(types.TRANSACTION_VOIDED),
	navigateProduct: createAction(types.NAVIGATE_PRODUCT),
	setPreviousSukli: createAction(types.SET_PREVIOUS_SUKLI),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProducts: () => createSelector(selectState, (state) => state.products),
	selectIsFullyPaid: () => createSelector(selectState, (state) => state.isFullyPaid),
	selectClientId: () => createSelector(selectState, (state) => state.clientId),
	selectTotalPaidAmount: () => createSelector(selectState, (state) => state.totalPaidAmount),
	selectInvoiceId: () => createSelector(selectState, (state) => state.invoiceId),
	selectOrNumber: () => createSelector(selectState, (state) => state.orNumber),
	selectTransactionId: () => createSelector(selectState, (state) => state.transactionId),
	selectTransactionStatus: () => createSelector(selectState, (state) => state.status),
	selectPreviousVoidedTransactionId: () =>
		createSelector(selectState, (state) => state.previousVoidedTransactionId),
	selectPageNumber: () => createSelector(selectState, (state) => state.pageNumber),
	selectPreviousSukli: () => createSelector(selectState, (state) => state.previousSukli),
};

export default reducer;
