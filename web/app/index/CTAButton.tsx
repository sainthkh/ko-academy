'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import { openDialog } from '../common/Dialog'
import styles from './CTAButton.css'

class CTAButton extends React.Component<{}, {}> {
	render() {
		return (
			<a styleName="cta-signup" href="#signup" onClick={ e => openDialog(e, 'subscribe')}>Join the Waiting List</a>
		);
	}
}

export default CSSModules(CTAButton, styles)
