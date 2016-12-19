'use strict';

import * as React from 'react';
import MenuBar from '../common/MenuBar'
import Overview from './Overview'
import TOC from './TOC'
import * as CSSModules from 'react-css-modules'
import styles from "./PageLayout.css"

class CourseTocPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="home">
				<MenuBar />
				<Overview title="Start your journey with Hangeul" details="You will learn how to read and write Hangeul, Korean Alphabet." />
				<TOC />
			</div>
		);
	}
}

export default CSSModules(CourseTocPage, styles)