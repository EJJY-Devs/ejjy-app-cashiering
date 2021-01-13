import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListBranchMachines extends IGetRequest {
	branch_id: number;
}

interface ICreateBranchMachine {
	name: string;
	machine_id: string;
	machine_printer_serial_number: string;
}

interface IUpdateBranchMachine {
	machine_id: string;
	machine_printer_serial_number: string;
}

export const service = {
	list: async (params: IListBranchMachines) => axios.get('/branches-machines/', { params }),
	get: async (id: number) => axios.get(`branches-machines/${id}`),
	create: async (body: ICreateBranchMachine) => axios.post('/branches-machines/', body),
	update: async (id: number, body: IUpdateBranchMachine) =>
		axios.patch(`/branches-machines/${id}/`, body),
	register: async (id: number) => axios.post(`/branches-machines/${id}/register/`),
};
