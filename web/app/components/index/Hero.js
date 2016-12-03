'use strict'
import React from 'react'
import CTAButton from './CTAButton'
import CSSModules from 'react-css-modules';
import styles from './Hero.css'

class Hero extends React.Component {
	render() {
		return (
			<div styleName="hero">
				<div className="wrap">
					<div styleName="content">
						<h1>Step by Step to Korean Master</h1>
						<CTAButton />
					</div>
				</div>
			</div>
		);
	}
}

export default CSSModules(Hero, styles)
