'use strict';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Layout from './Layout'
import IndexPage from './index/PageLayout'

export default class App extends React.Component {
	render() {
		return (
			<Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
				<Route path="/" component={Layout}>
					<IndexRoute component={IndexPage}/>
				</Route>
			</Router>
		);
	}
}