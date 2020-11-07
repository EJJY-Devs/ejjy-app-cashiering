import axios from 'axios';
import { flatten, values } from 'lodash';
import { API_TIMEOUT, API_URL } from './services';

export default function configureAxios() {
	axios.defaults.baseURL = API_URL;
	axios.defaults.timeout = API_TIMEOUT;

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
