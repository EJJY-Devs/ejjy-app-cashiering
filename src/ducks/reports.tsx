import { createAction } from 'redux-actions';

export const key = 'REPORTS';

export const types = {
	CREATE_XREAD_REPORT: `${key}/CREATE_XREAD_REPORT`,
	CREATE_ZREAD_REPORT: `${key}/CREATE_ZREAD_REPORT`,
};

export const actions = {
	createXreadReport: createAction(types.CREATE_XREAD_REPORT),
	createZreadReport: createAction(types.CREATE_ZREAD_REPORT),
};
