'use strict'
import React from 'react'
import CSSModules from 'react-css-modules';
import styles from './LoginButton.css'

class LoginButton extends React.Component {
	render() {
		return (
			<button styleName="login-btn">Login</button>
		);
	}
}

export default CSSModules(LoginButton, styles)
