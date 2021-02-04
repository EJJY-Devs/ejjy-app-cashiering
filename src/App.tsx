import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommonRoute } from './components';
import { Error404, Login, Reports } from './screens';
import { MainScreens } from './utils/routeMapping';
import { Helmet } from 'react-helmet';
import { APP_TITLE } from './global/constants';

const App = () => (
	<>
		<Helmet>
			<title>{APP_TITLE}</title>
		</Helmet>
		<Switch>
			<CommonRoute path="/login" exact component={Login} />
			<CommonRoute path="/reports" exact component={Reports} />
			<CommonRoute path="/" exact component={MainScreens} />

			<Route path="/404" exact component={Error404} />
			<Route path="" render={() => <Redirect to="/404" />} />
		</Switch>
	</>
);

export default App;
