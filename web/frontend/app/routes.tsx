import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './Layout'
import IndexPage from './pages/index/Layout'
import { CourseTocPage } from './pages/course-toc/Layout'
import { LecturePage } from './pages/lecture/Layout'
import PricingPage from './pages/pricing/Layout'
import QuizPage from './pages/quiz/Layout'

export const routes = (
	<Route path="/" component={Layout}>
		<IndexRoute component={IndexPage}/>
		<Route path="course/:slug" component={CourseTocPage} />
		<Route path="lecture/:courseSlug/:slug" component={LecturePage} />
		<Route path="pricing" component={PricingPage} />
		<Route path="quiz/:courseSlug/:slug" component={QuizPage} />
	</Route>
)