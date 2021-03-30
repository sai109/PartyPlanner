import * as React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from '../utils/history';
import Landing from '../components/Landing';
import Dashboard from '../components/Dashboard';
import CreateParty from '../components/CreateParty';
import EditParty from '../components/EditParty';



const AppRouter = (): JSX.Element => (
	<Router history={history}>
		<Switch>
			<Route exact path='/dashboard'>
				<Dashboard />
			</Route>
			<Route exact path='/'>
				<Landing />
			</Route>
			<Route exact path='/create'>
				<CreateParty />
      </Route>
      <Route exact path='/edit'>
				<EditParty />
			</Route>
		</Switch>
	</Router>
);

export default AppRouter;
