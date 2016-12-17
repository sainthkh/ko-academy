'use strict';

import * as React from 'react';
import MenuBar from '../common/MenuBar'
import * as CSSModules from 'react-css-modules'
import styles from "./PageLayout.css"

class CourseTocPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="home">
				<MenuBar />
				<div>Courses</div>
			</div>
		);
	}
}

export default CSSModules(CourseTocPage, styles)