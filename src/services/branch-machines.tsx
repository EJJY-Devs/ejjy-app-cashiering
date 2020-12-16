import axios from 'axios';

interface ICreateBranchMachine {
	name: string;
	machine_id: string;
	machine_printer_serial_number: string;
}

export const service = {
	get: async (id: number) => axios.get(`branches-machines/${id}`),
	create: async (body: ICreateBranchMachine) => axios.post('/branches-machines/', body),
};
