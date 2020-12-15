import axios from 'axios';

interface ICreateReport {
	branch_machine_id: number;
	user_id: number;
}

export const service = {
	createXread: async (body: ICreateReport) => axios.post('/xread-reports/', body),
	createZread: async (body: ICreateReport) => axios.post('/zread-reports/', body),
};
