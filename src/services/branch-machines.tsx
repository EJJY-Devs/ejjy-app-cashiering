import axios from 'axios';
import { IGetRequest } from '.';

export const service = {
	list: async (params: IGetRequest) => axios.get('/branches-machines/', { params }),

	register: async (id: number) => axios.post(`/branches-machines/${id}/register/`),
};
