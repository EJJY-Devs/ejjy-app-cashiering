import axios from 'axios';
import { StringNullableChain } from 'lodash';
import { IGetRequest } from '.';

interface IPayTransaction {
	transaction_id: number;
	amount_tendered: string;
	cashier_user_id: number;
}

interface ITransactionProduct {
	transaction_product_id?: number;
	product_id: number;
	quantity: number;
}

interface ICreateTransactionClient {
	name: string;
	address: string;
	tin: string;
}

interface ICreateTransaction {
	branch_machine_id: number;
	teller_id: string;
	client?: ICreateTransactionClient;
	products: ITransactionProduct[];
	previous_voided_transaction_id?: number;
	overall_discount?: number;
	status?: string;
}

interface IUpdateTransaction {
	products: ITransactionProduct[];
	overall_discount?: number;
	status?: string;
}

interface IListTransactions extends IGetRequest {
	branch_machine_id: number;
	teller_id: number;
	status: StringNullableChain;
}

export const service = {
	list: async (params: IListTransactions) => axios.get('/transactions/', { params }),
	get: async (id: number) => axios.get(`/transactions/${id}/`),
	pay: async (body: IPayTransaction) => axios.post('/payments/', body),
	create: async (body: ICreateTransaction) => axios.post('/transactions/', body),
	update: async (id: number, body: IUpdateTransaction) => axios.patch(`/transactions/${id}/`, body),
	void: async (id: number) => axios.post(`/transactions/${id}/void/`),
};
