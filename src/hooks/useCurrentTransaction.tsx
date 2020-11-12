import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';
import { useSession } from './useSession';
import { useTransactions } from './useTransactions';

export const useCurrentTransaction = () => {
	const products = useSelector(selectors.selectProducts());
	const isFullyPaid = useSelector(selectors.selectIsFullyPaid());
	const clientId = useSelector(selectors.selectClientId());
	const totalPaidAmount = useSelector(selectors.selectTotalPaidAmount());
	const invoiceId = useSelector(selectors.selectInvoiceId());
	const transactionId = useSelector(selectors.selectTransactionId());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const setCurrentTransaction = useActionDispatch(actions.setCurrentTransaction);
	const resetTransaction = useActionDispatch(actions.resetTransaction);

	const { session } = useSession();
	const { createTransaction, status: transactionsStatus } = useTransactions();
	const createCurrentTransaction = (callback = null) => {
		const data = {
			branchId: session?.branch_machine?.branch_id,
			branchMachineId: session.branch_machine.id,
			tellerId: session.user_id,
			dummyClientId: 1, // TODO: Update on next sprint
			products: products.map((product) => ({
				product_id: product.productId,
				quantity: product.quantity,
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
		products,
		isFullyPaid,
		clientId,
		totalPaidAmount,
		invoiceId,
		transactionId,
		addProduct,
		removeProduct,
		resetTransaction,
		setCurrentTransaction,
		createCurrentTransaction,
		status: transactionsStatus,
	};
};
