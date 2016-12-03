'use strict';

import React from 'react';
import { Link } from 'react-router';
import SignupDialog from './common/SignupDialog'
import CSSModules from 'react-css-modules';
import styles from './common/global.css'

class Layout extends React.Component {
	render() {
		return (
			<div className="app-container">
				<div className="app-content">
					{this.props.children}
				</div>
				<div className="util">
					<SignupDialog />
				</div>
			</div>
		);
	}
}

export default CSSModules(Layout, styles)