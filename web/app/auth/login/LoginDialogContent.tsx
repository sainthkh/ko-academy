'use strict'
import * as React from 'react'
import { default as Dialog, openDialog } from '../../common/Dialog'
import * as CSSModules from 'react-css-modules';
import styles from './LoginDialogContent.css'

export interface LoginDialogContentProps {
	waitingLogin: boolean
	loginErrors: any
}

class LoginDialogContentReact extends React.Component<LoginDialogContentProps, {}> {
	render() {
		var title = "Resume your Korean journey!"
		var main = (
			<div>
				<form method="POST" role="form">
					<input type="email" styleName="field" name="email" id="email" placeholder="email" />
					<input type="password" styleName="field" name="password" id="password" placeholder="password" />
					<button type="submit" styleName="submit">Login</button>
				</form>
			</div>
		)
		var footer = (
			<div>
				Did you mean to <a href="#login" onClick={ e => openDialog(e, 'signup')}>sign up</a>?
			</div>
		)
		return <Dialog ID="login" title={title} main={main} footer={footer}/>;
	}
}

export const LoginDialogContent = CSSModules(LoginDialogContentReact, styles) 
