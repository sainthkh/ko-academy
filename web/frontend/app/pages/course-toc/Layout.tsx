'use strict';

import * as React from 'react';
import { FetchableComponent } from '../../../common/lib/fetch'
import { FetchProps } from '../../../common/lib/fetch/props'
import MainBar from '../common/menu/MainBar'
import Overview from './Overview'
import TOC from './TOC'
import * as CSSModules from 'react-css-modules'
import styles from "./Layout.css"

class Layout extends React.Component<FetchProps, {}> {
	render() {
		return (
			<div>
				<MainBar />
				<Overview title="Start your journey with Hangeul" details="You will learn how to read and write Hangeul, Korean Alphabet." />
				<TOC />
			</div>
		);
	}
}

export const CourseTocPage = FetchableComponent({
	name: "course-toc",
	resource: "course",
})(CSSModules(Layout, styles))