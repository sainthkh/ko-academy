'use strict'
import React from 'react'
import { Link } from 'react-router';
import LoginButton from './LoginButton'
import CSSModules from 'react-css-modules';
import styles from './MenuBar.css'

class MenuBar extends React.Component {
	render() {
		return (
			<header styleName="menubar">
				<div className="wrap">
					<div styleName="content">
						<div styleName="logo">
							<Link to="/">
								<img src="/img/logo.png" />
								<span styleName="title">WiseInit Academy</span>
							</Link>
						</div>
						<div styleName="action">
							<LoginButton />
						</div>
					</div>
				</div>
			</header>
		);
	}
}

export default CSSModules(MenuBar, styles)