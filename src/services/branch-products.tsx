import axios from 'axios';
import { IGetRequest } from '.';

export const service = {
	listByBranch: async (params: IGetRequest) =>
		axios.get('branches-products/with-branch-manager-details/', { params }),
};
