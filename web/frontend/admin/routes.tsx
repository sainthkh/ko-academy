import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import { IndexPage } from './pages/index/Page'
import { BroadcastPage } from './pages/broadcast/Page'
import { AutoresponderPage } from './pages/autoresponder/Page'
import { CoursePage } from './pages/course/Page'

export const routes = (
	<Route path="/admin" component={Layout}>
		<IndexRoute component={IndexPage}/>
		<Route path="email">
			<Route path="notice(/:id)" component={BroadcastPage} />
			<Route path="autoresponder">
				<Route path="add" component={AutoresponderPage} />
			</Route>
		</Route>
		<Route path="course(/:id)" component={CoursePage} />
	</Route>
)