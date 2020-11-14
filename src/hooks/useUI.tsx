import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/ui';
import { useActionDispatch } from './useActionDispatch';

export const useUI = () => {
	const transactionIndex = useSelector(selectors.selectTransactionIndex());
	const mainLoading = useSelector(selectors.selectMainLoading());
	const mainLoadingText = useSelector(selectors.selectMainLoadingText());

	const setTransactionIndex = useActionDispatch(actions.setTransactionIndex);
	const setMainLoading = useActionDispatch(actions.setMainLoading);
	const setMainLoadingText = useActionDispatch(actions.setMainLoadingText);

	return {
		transactionIndex,
		mainLoading,
		mainLoadingText,

		setTransactionIndex,
		setMainLoading,
		setMainLoadingText,
	};
};
