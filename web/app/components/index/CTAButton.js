'use strict'
import React from 'react'
import CSSModules from 'react-css-modules';
import styles from './CTAButton.css'

class CTAButton extends React.Component {
	render() {
		return (
			<a styleName="cta-signup" href="#signup">Start Now</a>
		);
	}
}

export default CSSModules(CTAButton, styles)
