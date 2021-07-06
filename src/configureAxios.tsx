import axios from 'axios';
import { flatten, values } from 'lodash';
import { key as AUTH_KEY } from './ducks/auth';
import { API_TIMEOUT, NO_VERIFICATION_NEEDED } from './services';

export default function configureAxios(store) {
	axios.defaults.timeout = API_TIMEOUT;

	// add a request interceptor to all the axios requests
	// that are going to be made in the site. The purpose
	// of this interceptor is to verify if the access token
	// is still valid and renew it if needed and possible
	axios.interceptors.request.use(
		// eslint-disable-next-line func-names
		function (config) {
			// since there's no `connect` HOC, this is how we
			// access the store (or reducer)
			const { accessToken, localIpAddress } = store.getState()?.[AUTH_KEY];

			if (!config.baseURL) {
				config.baseURL = localIpAddress;
			}

			// if there's no verification needed, just exit immediately
			if (NO_VERIFICATION_NEEDED === config.params) {
				return config;
			}

			// Get access token from store for every api request
			config.headers.authorization = accessToken ? `Bearer ${accessToken}` : null;

			return config;
		},
		function (error) {
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(null, (error) => {
		const modifiedError = { ...error };

		if (error.isAxiosError) {
			if (typeof error.response.data === 'string') {
				modifiedError.errors = [error.response.data];
			} else {
				modifiedError.errors = flatten(values(error.response.data));
			}
		}

		return Promise.reject(modifiedError);
	});
}
