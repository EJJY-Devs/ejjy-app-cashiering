import { createAction } from 'redux-actions';

export const key = 'BRANCH_MACHINES';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_BRANCH_MACHINE: `${key}/GET_BRANCH_MACHINE`,
	REGISTER_BRANCH_MACHINE: `${key}/REGISTER_BRANCH_MACHINE`,
};

export const actions = {
	save: createAction(types.SAVE),
	getBranchMachine: createAction(types.GET_BRANCH_MACHINE),
	registerBranchMachine: createAction(types.REGISTER_BRANCH_MACHINE),
};
