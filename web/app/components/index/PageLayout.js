'use strict';

import React from 'react';
import MenuBar from '../common/MenuBar'
import CTA from './CTA'
import CSSModules from 'react-css-modules'
import styles from "./PageLayout.css"

class IndexPage extends React.Component {
	render() {
		return (
			<div styleName="home">
				<MenuBar />
				<CTA />
			</div>
		);
	}
}

export default CSSModules(IndexPage, styles)