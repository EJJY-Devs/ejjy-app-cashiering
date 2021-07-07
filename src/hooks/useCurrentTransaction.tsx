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
	const overallDiscount = useSelector(selectors.selectOverallDiscount());
	const isTransactionSearched = useSelector(selectors.selectIsTransactionSearched());

	const orNumber = useSelector(selectors.selectOrNumber());
	const previousVoidedTransactionId = useSelector(selectors.selectPreviousVoidedTransactionId());
	const pageNumber = useSelector(selectors.selectPageNumber());
	const previousChange = useSelector(selectors.selectPreviousChange());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const editProduct = useActionDispatch(actions.editProduct);
	const setCurrentTransaction = useActionDispatch(actions.setCurrentTransaction);
	const resetTransaction = useActionDispatch(actions.resetTransaction);
	const navigateProduct = useActionDispatch(actions.navigateProduct);
	const setPreviousChange = useActionDispatch(actions.setPreviousChange);
	const setClient = useActionDispatch(actions.setClient);
	const setDiscount = useActionDispatch(actions.setDiscount);

	const { session } = useSession();
	const { createTransaction, status: transactionsRequestStatus } = useTransactions();
	const createCurrentTransaction = ({
		status = undefined,
		callback = null,
		shouldResetTransaction = true,
	}) => {
		const data = {
			branchId: session.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user.id,
			client,
			previousVoidedTransactionId: previousVoidedTransactionId || undefined,
			products: transactionProducts.map((item) => ({
				product_id: item.product.id,
				quantity: item.quantity,
				price_per_piece: item.price_per_piece,
				discount_per_piece: item?.discount_per_piece || undefined,
			})),
			overallDiscount,
			status,
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
		overallDiscount,
		client,
		totalPaidAmount,
		orNumber,
		previousVoidedTransactionId,
		pageNumber,
		previousChange,
		isTransactionSearched,
		addProduct,
		removeProduct,
		editProduct,
		resetTransaction,
		setCurrentTransaction,
		createCurrentTransaction,
		navigateProduct,
		setPreviousChange,
		setClient,
		setDiscount,
		requestStatus: transactionsRequestStatus,
	};
};
