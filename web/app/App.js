'use strict';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Layout from './Layout'
import IndexPage from './index/PageLayout'
import reducer from './reducer'

let store = createStore(reducer)

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
					<Route path="/" component={Layout}>
						<IndexRoute component={IndexPage}/>
					</Route>
				</Router>
			</Provider>
		);
	}
}