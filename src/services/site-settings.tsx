import axios from 'axios';
import { IGetRequest, ONLINE_API_URL } from '.';

export const service = {
	get: async (params: IGetRequest) =>
		axios.get('site-settings/single/', { baseURL: ONLINE_API_URL, params }),
};
