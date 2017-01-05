'use strict';

import * as React from 'react';
import { Link } from 'react-router';
import AuthUI from './pages/common/auth/UIPackage'
import * as CSSModules from 'react-css-modules';
import styles from './Layout.css'

class Layout extends React.Component<{}, {}> {
	render() {
		return (
			<div className="app-container">
				<div className="app-content">
					{this.props.children}
				</div>
				<AuthUI />
			</div>
		);
	}
}

export default CSSModules(Layout, styles)