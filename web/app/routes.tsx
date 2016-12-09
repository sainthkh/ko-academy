import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import IndexPage from './index/PageLayout'

export const routes = (
	<Route path="/" component={Layout}>
		<IndexRoute component={IndexPage}/>
	</Route>
)