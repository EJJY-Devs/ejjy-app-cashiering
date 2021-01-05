import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'BRANCH_MACHINES';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_BRANCH_MACHINE: `${key}/GET_BRANCH_MACHINE`,
	GET_BRANCH_MACHINES: `${key}/GET_BRANCH_MACHINES`,
	REGISTER_BRANCH_MACHINE: `${key}/REGISTER_BRANCH_MACHINE`,
};

const initialState = {
	branchMachines: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_BRANCH_MACHINES: {
					newData = { branchMachines: payload.branchMachines };
					break;
				}
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getBranchMachine: createAction(types.GET_BRANCH_MACHINE),
	getBranchMachines: createAction(types.GET_BRANCH_MACHINES),
	registerBranchMachine: createAction(types.REGISTER_BRANCH_MACHINE),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectBranchMachines: () => createSelector(selectState, (state) => state.branchMachines),
};

export default reducer;
