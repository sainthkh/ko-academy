'use strict'
import * as React from 'react'
import { Link } from 'react-router';
import LoginButton from './LoginButton'
import * as CSSModules from 'react-css-modules';
import styles from './MainBar.css'

class MainBar extends React.Component<{}, {}> {
	render() {
		return (
			<header styleName="main-menu">
				<div className="wrap">
					<div styleName="content">
						<div styleName="logo">
							<Link to="/course/hangeul">
								<span styleName="title">WiseInit Academy</span>
							</Link>
						</div>
						<div styleName="action">
						</div>
					</div>
				</div>
			</header>
		);
	}
}

export default CSSModules(MainBar, styles)