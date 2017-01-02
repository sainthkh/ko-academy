'use strict';

import * as React from 'react';
import { Link } from 'react-router';
import * as CSSModules from 'react-css-modules';
import styles from './Layout.css'

class Layout extends React.Component<{}, {}> {
	render() {
		return (
			<div className="app-container">
				<div className="app-content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default CSSModules(Layout, styles)