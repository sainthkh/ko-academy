'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'
import styles from './Layout.css'

class IndexPage extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="home">
				<div styleName="login-form">
					<div styleName="title">WiseInit Academy Admin</div>
					<input type="text" styleName="field" name="id" placeholder="ID" />
					<input type="password" styleName="field" name="password" placeholder="Password" />
					<button type="submit" styleName="submit">Log in</button>
				</div>
			</div>
		);
	}
}

export default CSSModules(IndexPage, styles)