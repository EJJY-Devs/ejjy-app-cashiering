import axios from 'axios';
import { NO_VERIFICATION_CONFIG, ONLINE_API_URL } from '.';

interface ILogin {
	login: string;
	password: string;
}

interface IAcquireToken {
	username: string;
	password: string;
}

export const service = {
	login: async (body: ILogin, baseURL) =>
		axios.post('users/login/', body, { baseURL, ...NO_VERIFICATION_CONFIG }),

	acquireToken: async (body: IAcquireToken, baseURL = null) =>
		axios.post('tokens/acquire/', body, { baseURL, ...NO_VERIFICATION_CONFIG }),

	loginOnline: async (body: ILogin) =>
		axios.post('users/login_online/', body, { baseURL: ONLINE_API_URL, ...NO_VERIFICATION_CONFIG }),

	getBranch: async (branchId: number) =>
		axios.get(`branches/${branchId}/`, { baseURL: ONLINE_API_URL }),
};
