import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { useActionDispatch } from './useActionDispatch';

export const useCurrentTransaction = () => {
	const products = useSelector(selectors.selectProducts());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);

	return {
		products,
		addProduct,
		removeProduct,
	};
};
