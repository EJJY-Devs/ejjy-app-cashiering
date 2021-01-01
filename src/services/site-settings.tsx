import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListBranchProductsByBranchRequest extends IGetRequest {
	branch_id: number;
}

export const service = {
	get: async (params: IGetRequest) => axios.get('site-settings/single/', { params }),
};
