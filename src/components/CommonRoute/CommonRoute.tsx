import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { selectors } from '../../ducks/sessions';
import { userTypes } from '../../global/types';

const portal = ['/login'];
const not404Pages = ['/', '/login', 'reports'];
const noAuthPages = ['/reports'];

export const CommonRoute = ({ path, exact, component }: any) => {
	const { pathname: pathName } = useLocation();

	const session = useSelector(selectors.selectSession());

	if (!noAuthPages.includes(pathName)) {
		if (portal.includes(pathName) && session) {
			return <Route render={() => <Redirect to="/" />} />;
		}

		if (!portal.includes(pathName) && !session) {
			return <Route render={() => <Redirect to="/login" />} />;
		}

		if (!not404Pages.includes(pathName) && !component[userTypes.BRANCH_PERSONNEL]) {
			return <Route render={() => <Redirect to="404" />} />;
		}
	}

	return (
		<Route
			path={path}
			exact={exact}
			component={component[userTypes.BRANCH_PERSONNEL] || component}
		/>
	);
};
