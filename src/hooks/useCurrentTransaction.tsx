import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';
import { useSession } from './useSession';
import { useTransactions } from './useTransactions';

export const useCurrentTransaction = () => {
	const transactionId = useSelector(selectors.selectTransactionId());
	const transactionProducts = useSelector(selectors.selectProducts());
	const transactionStatus = useSelector(selectors.selectTransactionStatus());
	const isFullyPaid = useSelector(selectors.selectIsFullyPaid());
	const clientId = useSelector(selectors.selectClientId());
	const totalPaidAmount = useSelector(selectors.selectTotalPaidAmount());
	const invoiceId = useSelector(selectors.selectInvoiceId());
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

	const { session } = useSession();
	const { createTransaction, status: transactionsRequestStatus } = useTransactions();
	const createCurrentTransaction = (callback = null) => {
		const data = {
			branchId: session.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user.id,
			dummyClientId: 1, // TODO: Update on next sprint
			products: transactionProducts.map((product) => ({
				product_id: product.productId,
				quantity: product.quantity,
				price_per_piece: product.pricePerPiece,
			})),
		};

		createTransaction(data, ({ status }) => {
			if (status === request.SUCCESS) {
				resetTransaction();
				callback?.();
			}
		});
	};

	return {
		transactionId,
		transactionStatus,
		transactionProducts,
		isFullyPaid,
		clientId,
		totalPaidAmount,
		invoiceId,
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
		requestStatus: transactionsRequestStatus,
	};
};
