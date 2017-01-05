'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import { openDialog } from '../common/Dialog'
import styles from './CTAButton.css'

interface CTAButtonProps {
	dialogID: string
	text: string
	inverse?: boolean
}

class CTAButton extends React.Component<CTAButtonProps, {}> {
	render() {
		let style = this.props.inverse ? "cta-inverse" : "cta"
		return (
			<a styleName={style} onClick={ e => openDialog(e, this.props.dialogID)}>{this.props.text}</a>
		);
	}
}

export default CSSModules(CTAButton, styles)
