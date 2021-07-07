import axios from 'axios';
import { IGetRequest } from '.';

interface IListBranchProducts extends IGetRequest {
	search?: string;
}

export const service = {
	list: async (params: IListBranchProducts) => axios.get('branches-products/', { params }),
};
