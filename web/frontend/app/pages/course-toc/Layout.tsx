'use strict';

import * as React from 'react';
import MainBar from '../common/menu/MainBar'
import Overview from './Overview'
import TOC from './TOC'
import * as CSSModules from 'react-css-modules'
import styles from "./Layout.css"

class CourseTocPage extends React.Component<{}, {}> {
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

export default CSSModules(CourseTocPage, styles)