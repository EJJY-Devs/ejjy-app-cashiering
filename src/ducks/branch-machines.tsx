import { createAction } from 'redux-actions';

export const key = 'BRANCH_MACHINES';

export const types = {
	GET_BRANCH_MACHINES: `${key}/GET_BRANCH_MACHINES`,
	REGISTER_BRANCH_MACHINE: `${key}/REGISTER_BRANCH_MACHINE`,
};

export const actions = {
	getBranchMachines: createAction(types.GET_BRANCH_MACHINES),
	registerBranchMachine: createAction(types.REGISTER_BRANCH_MACHINE),
};
