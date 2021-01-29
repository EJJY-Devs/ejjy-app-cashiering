import axios from 'axios';
import { IGetRequest } from '.';

interface ICreateCashBreakdownSlip {
	cashiering_session_id: number;
	type: string;
	coins_25: number;
	coins_50: number;
	coins_1: number;
	coins_5: number;
	coins_10: number;
	bills_20: number;
	bills_50: number;
	bills_100: number;
	bills_200: number;
	bills_500: number;
	bills_1000: number;
}

interface IListCashBreakdownSlipsRequest extends IGetRequest {
	cashiering_session_id: number;
}

export const service = {
	list: async (params: IListCashBreakdownSlipsRequest) =>
		axios.get('/cash-breakdowns/', { params }),
	create: async (body: ICreateCashBreakdownSlip) => axios.post('/cash-breakdowns/', body),
};
