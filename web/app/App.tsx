'use strict';

import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import {routes} from './routes'
import reducer from './reducer'

let store = createStore(reducer)

export default class App extends React.Component<{}, {}> {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
			</Provider>
		);
	}
}