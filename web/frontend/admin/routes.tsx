import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import { IndexPage } from './pages/index/Page'
import { BroadcastPage } from './pages/broadcast/Page'
import { AutoresponderPage } from './pages/autoresponder/Page'

export const routes = (
	<Route path="/admin" component={Layout}>
		<IndexRoute component={IndexPage}/>
		<Route path="email">
			<Route path="notice">
				<Route path="add" component={BroadcastPage} />
			</Route>
			<Route path="autoresponder">
				<Route path="add" component={AutoresponderPage} />
			</Route>
		</Route>
	</Route>
)