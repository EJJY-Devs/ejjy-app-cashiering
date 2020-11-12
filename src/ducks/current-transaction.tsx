import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'CURRENT_TRANSACTION';

export const types = {
	ADD_PRODUCT: `${key}/ADD_PRODUCT`,
	REMOVE_PRODUCT: `${key}/REMOVE_PRODUCT`,
	SET_CURRENT_TRANSACTION: `${key}/SET_CURRENT_TRANSACTION`,
	UPDATE_TRANSACTION: `${key}/UPDATE_TRANSACTION`,
	RESET_TRANSACTION: `${key}/RESET_TRANSACTION`,
};

const initialState = {
	products: [],
	transactionId: null,
	isFullyPaid: false,
	clientId: null,
	totalPaidAmount: 0,
	invoiceId: null,
};

const reducer = handleActions(
	{
		[types.ADD_PRODUCT]: (state, { payload }: any) => {
			return { ...state, products: [...state.products, payload.product] };
		},

		[types.REMOVE_PRODUCT]: (state, { payload }: any) => {
			return { ...state, products: state.products.filter(({ id }) => id !== payload.id) };
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
				clientId: transaction.client_id,
				isFullyPaid: transaction.is_fully_paid,
				totalPaidAmount: transaction.total_paid_amount,
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
					pricePerPiece: branchProduct?.price_per_piece,
					quantity: item.quantity,
				};
			});

			const newData = {
				transactionId: transaction.id,
				invoiceId: transaction?.invoice?.id,
				clientId: transaction.client_id,
				isFullyPaid: transaction.is_fully_paid,
				totalPaidAmount: transaction.total_paid_amount,
				products,
			};

			return { ...state, ...newData };
		},

		[types.RESET_TRANSACTION]: () => {
			return initialState;
		},
	},
	initialState,
);

export const actions = {
	addProduct: createAction(types.ADD_PRODUCT),
	removeProduct: createAction(types.REMOVE_PRODUCT),

	setCurrentTransaction: createAction(types.SET_CURRENT_TRANSACTION),
	updateTransaction: createAction(types.UPDATE_TRANSACTION),
	resetTransaction: createAction(types.RESET_TRANSACTION),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProducts: () => createSelector(selectState, (state) => state.products),
	selectIsFullyPaid: () => createSelector(selectState, (state) => state.isFullyPaid),
	selectClientId: () => createSelector(selectState, (state) => state.clientId),
	selectTotalPaidAmount: () => createSelector(selectState, (state) => state.totalPaidAmount),
	selectInvoiceId: () => createSelector(selectState, (state) => state.invoiceId),
	selectTransactionId: () => createSelector(selectState, (state) => state.transactionId),
};

export default reducer;
