'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './CTAButton.css'

class CTAButton extends React.Component<{}, {}> {
	render() {
		return (
			<a styleName="cta-signup" href="#signup" onClick={ e => this.open(e)}>Start Now</a>
		);
	}

	open(e) {
		e.preventDefault()

		var dlg = document.getElementById('signup')
		dlg.classList.add("show-dialog")
	}
}

export default CSSModules(CTAButton, styles)
