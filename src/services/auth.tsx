import axios from 'axios';
import { NO_VERIFICATION_CONFIG } from '.';

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

	acquireToken: async (body: IAcquireToken) =>
		axios.post('tokens/acquire/', body, NO_VERIFICATION_CONFIG),
};
