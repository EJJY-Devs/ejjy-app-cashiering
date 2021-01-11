import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';
import { useSession } from './useSession';
import { useTransactions } from './useTransactions';

export const useCurrentTransaction = () => {
	const transaction = useSelector(selectors.selectTransaction());
	const transactionId = useSelector(selectors.selectTransactionId());
	const transactionProducts = useSelector(selectors.selectProducts());
	const transactionStatus = useSelector(selectors.selectTransactionStatus());
	const isFullyPaid = useSelector(selectors.selectIsFullyPaid());
	const client = useSelector(selectors.selectClient());
	const totalPaidAmount = useSelector(selectors.selectTotalPaidAmount());

	const orNumber = useSelector(selectors.selectOrNumber());
	const previousVoidedTransactionId = useSelector(selectors.selectPreviousVoidedTransactionId());
	const pageNumber = useSelector(selectors.selectPageNumber());
	const previousSukli = useSelector(selectors.selectPreviousSukli());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const editProduct = useActionDispatch(actions.editProduct);
	const setCurrentTransaction = useActionDispatch(actions.setCurrentTransaction);
	const resetTransaction = useActionDispatch(actions.resetTransaction);
	const navigateProduct = useActionDispatch(actions.navigateProduct);
	const setPreviousSukli = useActionDispatch(actions.setPreviousSukli);
	const setClient = useActionDispatch(actions.setClient);

	const { session } = useSession();
	const { createTransaction, status: transactionsRequestStatus } = useTransactions();
	const createCurrentTransaction = (callback = null, shouldResetTransaction = true) => {
		const data = {
			branchId: session.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user.id,
			client,
			previousVoidedTransactionId: previousVoidedTransactionId || undefined,
			products: transactionProducts.map((product) => ({
				product_id: product.productId,
				quantity: product.quantity,
				price_per_piece: product.pricePerPiece,
				discount_per_piece: product?.discountPerPiece || undefined,
			})),
		};

		createTransaction(data, (response) => {
			if (response.status === request.SUCCESS) {
				if (shouldResetTransaction) {
					resetTransaction();
				}
			}

			callback?.(response);
		});
	};

	return {
		transaction,
		transactionId,
		transactionStatus,
		transactionProducts,
		isFullyPaid,
		client,
		totalPaidAmount,
		orNumber,
		previousVoidedTransactionId,
		pageNumber,
		previousSukli,
		addProduct,
		removeProduct,
		editProduct,
		resetTransaction,
		setCurrentTransaction,
		createCurrentTransaction,
		navigateProduct,
		setPreviousSukli,
		setClient,
		requestStatus: transactionsRequestStatus,
	};
};
