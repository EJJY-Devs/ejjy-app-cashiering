import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/sessions';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useSession = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const session = useSelector(selectors.selectSession());

	const startSession = useActionDispatch(actions.startSession);
	const endSession = useActionDispatch(actions.endSession);
	const validateSession = useActionDispatch(actions.validateSession);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const startSessionRequest = (data, extraCallback = null) => {
		setRecentRequest(types.START_SESSION);

		startSession({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const endSessionRequest = (extraCallback = null) => {
		setRecentRequest(types.END_SESSION);

		endSession({
			sessionId: session?.id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const validateSessionRequest = (extraCallback = null) => {
		setRecentRequest(types.VALIDATE_SESSION);

		validateSession({
			sessionId: session?.id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		session,
		startSession: startSessionRequest,
		endSession: endSessionRequest,
		validateSession: validateSessionRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
