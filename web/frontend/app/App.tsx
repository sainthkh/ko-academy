'use strict';

import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux'

import {routes} from './routes'
import { createStore } from './store'

let store = createStore()

export default class App extends React.Component<{}, {}> {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
			</Provider>
		);
	}
}