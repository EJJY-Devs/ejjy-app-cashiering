import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommonRoute } from './components';
import { Error404, Landing, Login } from './screens';
import { MainScreens } from './utils/routeMapping';

const App = () => (
	<Switch>
		<CommonRoute path="/login" exact component={Login} />
		<CommonRoute path="/landing" exact component={Landing} />
		<CommonRoute path="/" exact component={MainScreens} />

		<Route path="/404" exact component={Error404} />
		<Route path="" render={() => <Redirect to="/404" />} />
	</Switch>
);

export default App;
