import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IPayTransaction {
	transaction_id: number;
	amount_tendered: string;
}

interface ITransactionProduct {
	transaction_product_id?: number;
	product_id: number;
	quantity: number;
}

interface ICreateTransaction {
	branch_machine_id: number;
	teller_id: string;
	dummy_client_id: number;
	products: ITransactionProduct[];
}

interface IUpdateTransaction {
	products: ITransactionProduct[];
}

interface IListTransactions extends IGetRequest {
	branch_id?: number;
}

export const service = {
	list: async (params: IListTransactions) => axios.get('/transactions/', { params }),
	pay: async (body: IPayTransaction) => axios.post('/payments/', body),
	create: async (body: ICreateTransaction) => axios.post('/transactions/', body),
	update: async (id: number, body: IUpdateTransaction) => axios.patch(`/transactions/${id}/`, body),
};
