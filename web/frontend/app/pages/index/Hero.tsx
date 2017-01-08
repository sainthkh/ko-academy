'use strict'
import * as React from 'react'
import CTAButton from './CTAButton'
import * as CSSModules from 'react-css-modules';
import styles from './Hero.css'

class Hero extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="hero">
				<div className="wrap">
					<div styleName="content">
						<h2>WiseInit Korean Academy</h2>
						<h1>Step by Step to Korean Master</h1>
						<div styleName="cta-box">
							<CTAButton dialogID="signup" text="Start Now" />
							<CTAButton dialogID="login" text="Resume" inverse={true}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CSSModules(Hero, styles)
