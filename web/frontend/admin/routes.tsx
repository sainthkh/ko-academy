import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import { IndexPage } from './pages/index/Page'
import { BroadcastPage } from './pages/Broadcast'
import { AutoresponderPage } from './pages/Autoresponder'
import { CoursePage } from './pages/Course'
import { LecturePage } from './pages/Lecture'

export const routes = (
	<Route path="/admin" component={Layout}>
		<IndexRoute component={IndexPage}/>
		<Route path="email">
			<Route path="notice(/:id)" component={BroadcastPage} />
			<Route path="autoresponder(/:id)" component={AutoresponderPage} />
		</Route>
		<Route path="course(/:id)" component={CoursePage} />
		<Route path="lecture(/:id)" component={LecturePage} />
	</Route>
)