'use strict'
import * as React from 'react'
import * as CSSModules from 'react-css-modules';
import { openDialog } from './Dialog'
import styles from './LoginButton.css'

class LoginButton extends React.Component<{}, {}> {
	render() {
		return (
			<button styleName="login-btn" onClick={e => openDialog(e, 'login')}>Login</button>
		);
	}
}

export default CSSModules(LoginButton, styles)
