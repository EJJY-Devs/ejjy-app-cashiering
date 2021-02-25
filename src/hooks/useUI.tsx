import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/ui';
import { useActionDispatch } from './useActionDispatch';

export const useUI = () => {
	const transactionIndex = useSelector(selectors.selectTransactionIndex());
	const mainLoading = useSelector(selectors.selectMainLoading());
	const mainLoadingText = useSelector(selectors.selectMainLoadingText());
	const barcodeScanningEnabled = useSelector(selectors.selectBarcodeScanningEnabled());
	const isSearchSuggestionVisible = useSelector(selectors.selectIsSearchSuggestionVisible());
	const isModalVisible = useSelector(selectors.selectIsModalVisible());

	const setTransactionIndex = useActionDispatch(actions.setTransactionIndex);
	const setMainLoading = useActionDispatch(actions.setMainLoading);
	const setMainLoadingText = useActionDispatch(actions.setMainLoadingText);
	const setBarcodeScanningEnabled = useActionDispatch(actions.setBarcodeScanningEnabled);
	const setSearchSuggestionVisible = useActionDispatch(actions.setSearchSuggestionVisible);
	const setModalVisible = useActionDispatch(actions.setModalVisible);

	return {
		transactionIndex,
		mainLoading,
		mainLoadingText,
		barcodeScanningEnabled,
		isSearchSuggestionVisible,
		isModalVisible,

		setTransactionIndex,
		setMainLoading,
		setMainLoadingText,
		setBarcodeScanningEnabled,
		setSearchSuggestionVisible,
		setModalVisible,
	};
};
