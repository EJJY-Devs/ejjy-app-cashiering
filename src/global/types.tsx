export const request = {
	NONE: 0,
	REQUESTING: 1,
	SUCCESS: 2,
	ERROR: 3,
};

export const productNavigation = {
	RESET: 'reset',
	NEXT: 'next',
	PREV: 'prev',
};

export const userTypes = {
	OFFICE_MANAGER: 'office_manager',
	BRANCH_MANAGER: 'branch_manager',
	BRANCH_PERSONNEL: 'branch_personnel',
};

export const cashBreakdownTypes = {
	START_SESSION: 'start_session',
	MID_SESSION: 'mid_session',
	END_SESSION: 'end_session',
};

export const branchProductStatus = {
	AVAILABLE: 'available',
	REORDER: 'reorder',
	OUT_OF_STOCK: 'out_of_stock',
};

export const navigationTypes = {
	PREVIOUS: -1,
	NEXT: 1,
};

export const transactionStatusTypes = {
	FULLY_PAID: 'fully_paid',
	HOLD: 'hold',
	VOID: 'void',
	VOID_CANCELLED: 'void_cancelled',
};
