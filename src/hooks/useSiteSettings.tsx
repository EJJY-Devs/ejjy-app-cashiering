import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/site-settings';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useSiteSettings = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const siteSettings = useSelector(selectors.selectSiteSettings());
	const getSiteSettings = useActionDispatch(actions.getSiteSettings);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getSiteSettingsRequest = () => {
		setRecentRequest(types.GET_SITE_SETTINGS);
		getSiteSettings({ callback });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		siteSettings,
		getSiteSettings: getSiteSettingsRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
