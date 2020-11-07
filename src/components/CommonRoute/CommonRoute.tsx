import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { selectors } from '../../ducks/sessions';
import { userTypes } from '../../global/types';

const portal = ['/login'];
const not404Pages = ['/', '/login', '/landing'];

export const CommonRoute = ({ path, exact, component }: any) => {
	const { pathname: pathName } = useLocation();

	const session = useSelector(selectors.selectSession());

	if (portal.includes(pathName) && session) {
		return <Route render={() => <Redirect to="/landing" />} />;
	}

	if (!portal.includes(pathName) && !session) {
		return <Route render={() => <Redirect to="/login" />} />;
	}

	if (!not404Pages.includes(pathName) && !component[userTypes.BRANCH_PERSONNEL]) {
		return <Route render={() => <Redirect to="404" />} />;
	}

	return (
		<Route
			path={path}
			exact={exact}
			component={component[userTypes.BRANCH_PERSONNEL] || component}
		/>
	);
};
