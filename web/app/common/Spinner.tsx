'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import styles from './Spinner.css'

class Spinner extends React.Component<{}, {}> {
	render() {
		return (
			<div styleName="spinner">
				<div styleName="dot1"></div>
				<div styleName="dot2"></div>
			</div>
		);
	}
}

export default CSSModules(Spinner, styles)
