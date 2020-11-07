import axios from 'axios';

interface IStartSession {
	login: string;
	password: string;
	branch_machine_mac_address: string;
}

export const service = {
	startSession: async (body: IStartSession) => axios.post('/cashiering-sessions/start/', body),
	endSession: async (id: number) => axios.post(`/cashiering-sessions/${id}/end/`),
	validateSession: async (id: number) => axios.post(`/cashiering-sessions/${id}/validate/`),
};
