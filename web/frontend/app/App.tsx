'use strict';

import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux'

import {routes} from './routes'
import { createStore } from './store'
import { isTokenValid, getToken, setToken, removeToken } from '../common/lib/token'
import { fetch } from '../common/lib/fetch'

let store = createStore()

export default class App extends React.Component<{}, {}> {
	componentWillMount() {
		store.dispatch(dispatch => {
			if(isTokenValid()) {
				return fetch({
					admin: false,
					method: 'POST',
					args: {
						token: getToken(),
					},
					resource: '/renew-token',
					token: getToken(),
				})
				.then((result:any) => {
					if (result.success) {
						setToken(result.token)
						dispatch({
							type: "RENEW_TOKEN",
							token: result.token
						})
					} else {
						removeToken()
					}
				})
			}
		})
	}

	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
			</Provider>
		);
	}
}