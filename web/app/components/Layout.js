'use strict';

import React from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from './common/global.css'

class Layout extends React.Component {
	render() {
		return (
			<div className="app-container">
				{this.props.children}
			</div>
		);
	}
}

export default CSSModules(Layout, styles)