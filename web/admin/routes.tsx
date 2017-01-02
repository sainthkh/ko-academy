import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import IndexPage from './pages/index/Layout'
import NewBroadCast from './pages/broadcast/Layout'

export const routes = (
	<Route path="/admin" component={Layout}>
		<IndexRoute component={IndexPage}/>
		<Route path="email">
			<Route path="notice">
				<Route path="add" component={NewBroadCast} />
			</Route>
		</Route>
	</Route>
)