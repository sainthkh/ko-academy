'use strict';

import * as React from 'react';
import MainBar from '../common/menu/MainBar'
import Hero from './Hero'
import * as CSSModules from 'react-css-modules'
import styles from "./Layout.css"

class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="wrap">
				<Hero />
			</div>
		);
	}
}

export default CSSModules(IndexPage, styles)