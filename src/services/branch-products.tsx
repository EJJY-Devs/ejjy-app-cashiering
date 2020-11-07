import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListBranchProductsByBranchRequest extends IGetRequest {
	branch_id: number;
}

export const service = {
	listByBranch: async (params: IListBranchProductsByBranchRequest) =>
		axios.get('branches-products/with-branch-manager-details/', { params }),
};
