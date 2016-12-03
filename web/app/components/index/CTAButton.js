'use strict'
import React from 'react'
import CSSModules from 'react-css-modules';
import styles from './CTAButton.css'

class CTAButton extends React.Component {
	render() {
		return (
			<button styleName="cta-signup">Start Now</button>
		);
	}
}

export default CSSModules(CTAButton, styles)
